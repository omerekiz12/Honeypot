from django.urls import path
from django.contrib.auth.views import logout_then_login

from router.views import login, config, text, help, main, frame, js, base

app_name = "router"

urlpatterns = [
    path('', login, name='login'),
    path('config/<str:templateName>', config, name= 'config'),
    path('xml/<str:templateName>', text, name= 'text'),
    path('help/<path:templateName>', help, name = "help"),
    path('frame/<path:templateName>', frame, name = "frame"),
    path('main/<path:templateName>', main, name = "main"),
    path('js/<path:templateName>', js, name = "js"),
    path('<path:templateName>', base, name = "base")
]