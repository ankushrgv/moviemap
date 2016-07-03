"""
moviemap URL Configuration

"""
from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
	url(r'^', include('apps.m_maps.urls', namespace='m_maps')),
    url(r'^admin/', admin.site.urls),
]
