
from django.views.generic.base import TemplateView
from apps.m_maps import models


class Index(TemplateView):

	template_name = 'm_maps/index.html'

	def get_context_data(self, **kwargs):

		context = super(Index, self).get_context_data(**kwargs)
		return context