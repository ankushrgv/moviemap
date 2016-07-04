
from django.conf import settings
from django.db.models import Q
from django.http import HttpResponse
from django.views.generic.base import TemplateView
from ordereddict import OrderedDict
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView


from apps.m_maps import models
from apps.m_maps import serializers

import json
import requests
import urllib

class Index(TemplateView):

	template_name = 'm_maps/index.html'

	def get_context_data(self, **kwargs):

		context = super(Index, self).get_context_data(**kwargs)
		return context


class SearchFieldList(APIView):
	"""
	List all snippets, or create a new snippet.
	"""
	def get(self, request, search_type, format=None):
		
		if search_type == 'title':
			movies = models.Movie.objects.all()
			serializer = serializers.MovieListSerializer(movies, many=True)

		elif search_type == 'production_company':
			companies = models.ProductionCompany.objects.all()
			serializer = serializers.ProductionCompanyListSerializer(companies, many=True)
		
		elif search_type == 'distributor':
			distributors = models.Distributor.objects.all()
			serializer = serializers.DistributorListSerializer(distributors, many=True)
		
		elif search_type == 'director':
			directors = models.Director.objects.all()
			serializer = serializers.DirectorListSerializer(directors, many=True)
		
		elif search_type == 'writer':
			writers = models.Writer.objects.all()
			serializer = serializers.WriterListSerializer(writers, many=True)
		
		elif search_type == 'actor':
			actors = models.Actor.objects.all()
			serializer = serializers.ActorListSerializer(actors, many=True)
		
		return Response(serializer.data)

# @api_view 
class SearchFormSubmit(APIView):
	
	def post(self, request, format=None):

		if request.method == 'POST':

			content = request.POST
			print 'search type = ', content['search_type']

			if content['search_type'] == 'title':
				print "its title!!"
				movies = models.Movie.objects.filter(title=content['searched_string'])

			elif content['search_type'] == 'production_company':
				print "its pc!!"
				movies = models.Movie.objects.filter(production_company__production_company=content['searched_string'])

			elif content['search_type'] == 'distributor':
				print "its distributor!!"
				movies = models.Movie.objects.filter(distributor__distributor=content['searched_string'])

			elif content['search_type'] == 'director':
				print "its director!!"
				movies = models.Movie.objects.filter(director__director=content['searched_string'])

			elif content['search_type'] == 'writer':
				print "its writer!!"
				movies = models.Movie.objects.filter(writer__writer=content['searched_string'])

			elif content['search_type'] == 'actor':
				print "its actor!!"
				movies = models.Movie.objects.filter(Q(actor1__actor=content['searched_string']) | Q(actor2__actor=content['searched_string']) | Q(actor3__actor=content['searched_string']))
			
			print movies				
			serializer = serializers.MovieDetailedListSerializer(movies, many=True)

			base_url = settings.GOOGLE_GEOCODING_BASE_URL
			api_key = settings.GOOGLE_GEOCODING_API_KEY

			if movies:
				no_of_movies =  len(serializer.data) 
				print "serializer title = ", serializer.data[0]['title']

				i = 0

				while i < no_of_movies:
					movie_location = serializer.data[i]['location']
					no_of_locations = len(movie_location)
					j = 0

					while j < no_of_locations:
						loc = movie_location[j]['location']
						
						print 'loc = ', loc
						
						url_context = OrderedDict()
						url_context['address'] = loc + " San Francisco, CA, USA"

						print 'url_context address = ',url_context['address']

						url_context['key'] = settings.GOOGLE_GEOCODING_API_KEY

						url = base_url % urllib.urlencode(url_context)
						# print url

						google_response = requests.get(url)
						data = google_response.json()
						
						print data['results'][0]['geometry']['location']
						print type(data['results'][0]['geometry']['location'])

						## Epicness
						serializer.data[i]['location'][j]['latlong'] = data['results'][0]['geometry']['location']

						j += 1

					i += 1

			return Response(serializer.data)

		else:
			return HttpResponse(
				json.dumps({"nothing to see": "this isn't happening"})
			)