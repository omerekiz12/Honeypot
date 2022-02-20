from django.shortcuts import render, redirect
from django.views.generic import TemplateView

# Create your views here.

def MainView(request):
    return render(request,"login.html", {"ErrNum": 3})

def login(request):
    #Authorization=Basic%20YWRtaW46MjEyMzJmMjk3YTU3YTVhNzQzODk0YTBlNGE4MDFmYzM%3D
    if(request.COOKIES.get("Authorization") == "Basic%20YWRtaW46MjEyMzJmMjk3YTU3YTVhNzQzODk0YTBlNGE4MDFmYzM%3D"):
        return render(request, "index.html",{"ErrNum": 3})
    else:
        return render(request,"login.html", {"ErrNum": 2})

def cgi(request):
    return render(request, "index.html")