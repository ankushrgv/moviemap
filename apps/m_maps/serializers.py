from rest_framework import serializers

from apps.m_maps import models


class ProductionCompanyListSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.ProductionCompany
		fields = ('id', 'production_company')


class DistributorListSerializer(serializers.ModelSerializer):
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


class MovieListSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.Movie
		depth = 2
		fields = ('id', 'title',)


class MovieDetailedListSerializer(serializers.ModelSerializer):

	class Meta:
		model = models.Movie
		depth = 2
		fields = '__all__'	