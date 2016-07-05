from __future__ import unicode_literals

from django.db import models

# Create your models here.


class Location(models.Model):
	location = models.CharField(max_length=100)
	fun_facts = models.CharField(max_length=400, blank=True, null=True)

	def __unicode__(self):
		return u'%s' % self.location


class ReleaseYear(models.Model):
	year = models.CharField(max_length=4, db_index=True)

	def __unicode__(self):
		return u'%s' % self.year

class ProductionCompany(models.Model):
	production_company = models.CharField(max_length=50, db_index=True)

	def __unicode__(self):
		return u'%s' % self.production_company

class Distributor(models.Model):
	distributor = models.CharField(max_length=50, db_index=True)

	def __unicode__(self):
		return u'%s' % self.distributor

class Director(models.Model):
	director = models.CharField(max_length=30, db_index=True)

	def __unicode__(self):
		return u'%s' % self.director

class Writer(models.Model):
	writer = models.CharField(max_length=30, db_index=True)

	def __unicode__(self):
		return u'%s' % self.writer

class Actor(models.Model):
	actor = models.CharField(max_length=30, db_index=True)

	def __unicode__(self):
		return u'%s' % self.actor

class Movie(models.Model):
	title = models.CharField(max_length=80, db_index=True)
	release_year = models.ForeignKey(ReleaseYear)
	location = models.ManyToManyField(Location)
	production_company = models.ForeignKey(ProductionCompany)
	distributor = models.ForeignKey(Distributor, blank=True, null=True)
	director = models.ManyToManyField(Director)
	writer = models.ManyToManyField(Writer)
	actor1 = models.ForeignKey(Actor, blank=True, null=True, related_name='actor1')
	actor2 = models.ForeignKey(Actor, blank=True, null=True, related_name='actor2')
	actor3 = models.ForeignKey(Actor, blank=True, null=True, related_name='actor3')

	def __unicode__(self):
		return u'%s' % self.title