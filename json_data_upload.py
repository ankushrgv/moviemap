import sys
import os

ROOT_FOLDER = os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
if ROOT_FOLDER not in sys.path:
	sys.path.insert(1, ROOT_FOLDER + '/')
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

import django
django.setup()

from apps.m_maps import models
import json

f = open(os.path.abspath('./json/sf_movies.json'), 'r')
content = f.read()
datamain = json.loads(content)

total_entries = len(datamain)
i = 8

while i < total_entries:

	actor3_obj = None
	if datamain[i]['Actor 3'] != 0:
		try:
			actor3_obj = models.Actor.objects.get(actor=datamain[i]['Actor 3'])
		except:
			actor3_obj = models.Actor.objects.create(actor=datamain[i]['Actor 3'])


	actor2_obj = None
	if datamain[i]['Actor 2'] != 0:
		actor2_obj = None
		try:
			actor2_obj = models.Actor.objects.get(actor=datamain[i]['Actor 2'])
		except:
			actor2_obj = models.Actor.objects.create(actor=datamain[i]['Actor 2'])

	actor1_obj = None
	if datamain[i]['Actor 1'] != 0:
		try:
			actor1_obj = models.Actor.objects.get(actor=datamain[i]['Actor 1'])
		except:
			actor1_obj = models.Actor.objects.create(actor=datamain[i]['Actor 1'])

	writer_obj = None
	if datamain[i]['Writer'] != 0:
		try:
			writer_obj = models.Writer.objects.get(writer=datamain[i]['Writer'])
		except:
			writer_obj = models.Writer.objects.create(writer=datamain[i]['Writer'])

	director_obj = None
	if datamain[i]['Director'] != 0:
		try:
			director_obj = models.Director.objects.get(director=datamain[i]['Director'])
		except:
			director_obj = models.Director.objects.create(director=datamain[i]['Director'])

	distributor_obj = None
	if datamain[i]['Distributor'] != 0:
		try:
			distributor_obj = models.Distributor.objects.get(distributor=datamain[i]['Distributor'])
		except:
			distributor_obj = models.Distributor.objects.create(distributor=datamain[i]['Distributor'])


	production_company_obj = None
	if datamain[i]['Production Company'] != 0:
		try:
			production_company_obj = models.ProductionCompany.objects.get(production_company=(datamain[i]['Production Company']))
		except:
			production_company_obj = models.ProductionCompany.objects.create(production_company=datamain[i]['Production Company'])

	funfacts = None
	if datamain[i]['Fun Facts'] != 0:
		funfacts = datamain[i]['Fun Facts']

	location_obj = None
	if datamain[i]['Locations'] != 0:
		try:
			location_obj = models.Location.objects.get(location=datamain[i]['Locations'])
		except:
			location_obj = models.Location.objects.create(location=(datamain[i]['Locations']), fun_facts=funfacts)

	release_year_obj = None
	if datamain[i]['Release Year'] != 0:
		try:
			release_year_obj = models.ReleaseYear.objects.get(year=datamain[i]['Release Year'])
		except:
			release_year_obj = models.ReleaseYear.objects.create(year=datamain[i]['Release Year'])
			# release_year_obj.save()

	# print release_year_obj.year

	movie_obj = None
	try:
		movie_obj = models.Movie.objects.get(title=datamain[i]['Title'])
		movie_obj.location.add(location_obj)
		movie_obj.save()

	except:
		movie_obj = models.Movie.objects.create(
			title=datamain[i]['Title'],
			release_year=release_year_obj,
			production_company=production_company_obj,
			distributor=distributor_obj,
			actor1=actor1_obj,
			actor2=actor2_obj,
			actor3=actor3_obj)

		movie_obj.save()

		if location_obj is not None:
			movie_obj.location.add(location_obj)
		if director_obj is not None:
			movie_obj.director.add(director_obj)
		if writer_obj is not None:
			movie_obj.writer.add(writer_obj)

		movie_obj.save()

	i += 1