from rest_framework import serializers

from apps.m_maps import models


class MovieListSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Movie
		fields = ('id', 'title', 'release_year')


class ProductionCompanyListSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.ProductionCompany
		fields = ('id', 'production_company')


class DistributorSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Distributor
		fields = ('id', 'distributor')


class DirectorListSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Director
		fields = ('id', 'director')


class WriterListSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Writer
		fields = ('id', 'writer')

class ActorListSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Actor
		fields = ('id', 'actor')