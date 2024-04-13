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
from django.db.models import Avg
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
            potassium = data.get('potassium'),
            location = data.get('location'),
            unique_id = data.get('unique_id')
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

def SendEmail(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        # Save form submission to the database
        submission = ContactFormSubmission.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )

        # Optionally, send confirmation email, process data, etc.

        return JsonResponse({'message': 'success'})
    else:
        return JsonResponse({'message': 'error'})

def display_data(request):
    data = IotData.objects.all()  # fetches all objects from your model
    averages = {
        'temperature_avg': round(data.aggregate(Avg('temperature'))['temperature__avg'] or 0, 2),
        'pHValue_avg': round(data.aggregate(Avg('pHValue'))['pHValue__avg'] or 0, 2),
        'turbidity_avg': round(data.aggregate(Avg('turbidity'))['turbidity__avg'] or 0, 2),
        'dissolved_oxygen_avg': round(data.aggregate(Avg('dissolved_oxygen'))['dissolved_oxygen__avg'] or 0, 2),
        'water_level_sensor_avg': round(data.aggregate(Avg('water_level_sensor'))['water_level_sensor__avg'] or 0, 2),
        'moisture_sensor_avg': round(data.aggregate(Avg('moisture_sensor'))['moisture_sensor__avg'] or 0, 2),
        'nitrogen_avg': round(data.aggregate(Avg('nitrogen'))['nitrogen__avg'] or 0, 2),
        'phosphorous_avg': round(data.aggregate(Avg('phosphorous'))['phosphorous__avg'] or 0, 2),
        'potassium_avg': round(data.aggregate(Avg('potassium'))['potassium__avg'] or 0, 2),
    }
    return render(request, 'analysis.html', {'data': data, 'averages': averages})

def cropdata(request, username):
    if request.method == 'POST':
        farmId = request.POST.get('farmId')
        cropType = request.POST.get('cropType')
        location = request.POST.get('location')
        sowingDate = request.POST.get('sowingDate')
        harvestDate = request.POST.get('harvestDate')
        soilType = request.POST.get('soilType')
        # Retrieve IoT data for the given farmId
        data = IotData.objects.filter(username=username, unique_id=farmId).order_by('-created_at').first()
        
        if data:
            # Extract soil properties and sensor data
            potassium = data.potassium
            phosphorus = data.phosphorous
            nitrogen = data.nitrogen
            water_level_sensor = data.water_level_sensor
            moisture_sensor = data.moisture_sensor
            
            # Initialize analysis results dictionary
            analysis_results = {
                'suitable_for_crop': True,
                'deficiencies': []
            }
            
            # Define standard threshold values
            standard_thresholds = {
                'nitrogen_min': 80,
                'nitrogen_max': 170,
                'potassium_min': 85,
                'potassium_max': 170,
                'phosphorus_min': 85,
                'phosphorus_max': 170,
                'moisture_min': 750,
                'moisture_max': 930,
                'water_level_min': 2,
                'water_level_max': 6,
            }
            
            # Crop Suitability Analysis
            if nitrogen < standard_thresholds['nitrogen_min'] or nitrogen > standard_thresholds['nitrogen_max']:
                analysis_results['suitable_for_crop'] = False
                analysis_results['deficiencies'].append('Nitrogen deficiency/excess')
            if potassium < standard_thresholds['potassium_min'] or potassium > standard_thresholds['potassium_max']:
                analysis_results['suitable_for_crop'] = False
                analysis_results['deficiencies'].append('Potassium deficiency/excess')
            if phosphorus < standard_thresholds['phosphorus_min'] or phosphorus > standard_thresholds['phosphorus_max']:
                analysis_results['suitable_for_crop'] = False
                analysis_results['deficiencies'].append('Phosphorus deficiency/excess')
            if moisture_sensor < standard_thresholds['moisture_min'] or moisture_sensor > standard_thresholds['moisture_max']:
                analysis_results['suitable_for_crop'] = False
                analysis_results['deficiencies'].append('Moisture level not suitable')
            if water_level_sensor < standard_thresholds['water_level_min'] or water_level_sensor > standard_thresholds['water_level_max']:
                analysis_results['suitable_for_crop'] = False
                analysis_results['deficiencies'].append('Water level not suitable')
            
            # Pass analysis results to the template
            context = {
                'potassium': potassium,
                'phosphorus': phosphorus,
                'nitrogen': nitrogen,
                'water_level_sensor': water_level_sensor,
                'moisture_sensor': moisture_sensor,
                'cropType': cropType,
                'location': location,
                'sowingDate': sowingDate,
                'harvestDate': harvestDate,
                'analysis_results': analysis_results
            }
        else:
            # Handle case where no IoT data is found for the given farmId
            context = {
                'error': 'No IoT data found for the specified farm ID.'
            }
            print(context)
            
        return render(request, "crop.html", {'context':context})
    else:
        return render(request, "crop.html")
        
    
def npk(request):
    return render(request, "npk.html")