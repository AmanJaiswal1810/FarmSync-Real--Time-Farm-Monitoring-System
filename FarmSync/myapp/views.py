from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from django.views import View
from .models import IotData
from .serializers import IotDataSerializer
from django.forms import ValidationError
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.models import auth
from .models import *
from .models import Room
# Create your views here.

def index(request):
    return render(request,'index.html')

def login(request):
    if request.method == 'POST':
        Username = request.POST['username']
        Password = request.POST['password']
        user = auth.authenticate(username = Username, password = Password)
        if user is not None:
            auth.login(request, user)
            return redirect('/')
        else:
            messages.info(request,"Invalid credentials/ User does not exists")
            return redirect('login')
    else:
        return render(request, 'login.html')

def logout(request):
    auth.logout(request)
    return redirect('/')

def home(request):
    return redirect('/')

class iotDataView(APIView):
    def get(self, request):
        data = IotData.objects.all()
        serializer = IotDataSerializer(data, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not User.objects.filter(username = username).exists():
            user = User.objects.create_user(username=username, password=password)
            user.save()

        iotdata = IotData.objects.create(
            username = data.get('username'),
            password = data.get('password'),
            temperature = data.get('temperature'),
            pHValue = data.get('pHValue'),
            turbidity = data.get('turbidity'),
            dissolved_oxygen = data.get('dissolved_oxygen'),
            water_level_sensor = data.get('water_level_sensor'),
            moisture_sensor = data.get('moisture_sensor'),
            nitrogen = data.get('nitrogen'),
            phosphorous = data.get('phosphorous'),
            potassium = data.get('potassium')
        )
        iotdata.save()
        return Response(data, status=status.HTTP_200_OK)

    def options(self, request, *args, **kwargs):
        response = JsonResponse({'message': 'CORS allowed'})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response


def checkview(request, username):
    room = 'GroupChat'
    return redirect('/'+room+'/?username='+username)

def room(request, room):
    username = request.GET.get('username')
    room_details = Room.objects.get(name= room)
    return render(request, 'room.html', {
        'username' : username,
        'room' : room,
        'room_details' : room_details
    })

def send(request):
    username = request.POST['username']
    room_id = request.POST['room_id']
    message = request.POST['message']
    new_message = Message.objects.create(value = message, user = username, room = room_id)
    new_message.save()
    return HttpResponse('Message sent successfully')
    
def getMessages(request, room):
    room_details = Room.objects.get(name = room)
    messages = Message.objects.filter(room = room_details.id)
    return JsonResponse({'messages':list(messages.values())})

def blogs(request):
    Posts = post.objects.all()
    return render(request, 'blogs.html', {'Post':Posts})

def Posts(request, postk):
    Post = post.objects.get(id = postk)
    return render(request, 'Posts.html', {'Posts' : Post})

def result(request, username):
    return render(request, 'result.html', {'username': username})

def soilresult(request, username):
    return render(request, 'dashboard2.html', {'username' : username})