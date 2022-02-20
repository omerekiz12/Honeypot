from django.shortcuts import render

# Create your views here.

def login(request):
    #Authorization=Basic%20YWRtaW46MjEyMzJmMjk3YTU3YTVhNzQzODk0YTBlNGE4MDFmYzM%3D
    #Authorization=Basic YWRtaW46YWRtaW4=
    if(request.COOKIES.get("Authorization") == "Basic YWRtaW46YWRtaW4="):
        return render(request, "index.html")
    else:
        #print(request.COOKIES.get("Authorization"))
        return render(request,"login.html")

def config(request, templateName):
    return render(request, "config/" + templateName, content_type="text/xml")

def text(request, templateName):
    return render(request, "xml/" + templateName, content_type="text/plain")

def help(request, templateName):
    return render(request, "help/" +templateName)

def main(request, templateName):
    return render(request, "main/" + templateName)

def frame(request, templateName):
    return render(request, "frame/" + templateName)

def js(request, templateName):
    return render(request, "js/" + templateName)

def base(request, templateName):
    return render(request, templateName)