
from django.views.generic.base import TemplateView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.m_maps import models
from apps.m_maps import serializers

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
		# print "movie serializer data = ",serializer.data
		return Response(serializer.data)


class SearchFormSubmit(APIView):
	