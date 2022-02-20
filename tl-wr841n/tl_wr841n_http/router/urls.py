from django.urls import path
from django.contrib.auth.views import logout_then_login

from .views import login , MainView, cgi

app_name = "router"
urlpatterns = [
    path('',MainView, name='MainView'),
    path('userRpm/LoginRpm.htm', login, name='login'),
    path('cgi', cgi, name='cgi' )
]