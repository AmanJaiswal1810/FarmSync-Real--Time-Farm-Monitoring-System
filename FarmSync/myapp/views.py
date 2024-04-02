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
# Create your views here.

def index(request):
    return render(request,'index.html')

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