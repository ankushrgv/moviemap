from django.conf.urls import url

import views

urlpatterns = [
    url(r'^$',views.Index.as_view(), name='index'),
    url(r'^searchfieldlist/(?P<search_type>[\w]+)$',views.SearchFieldList.as_view(), name='searchfieldlist'),
]