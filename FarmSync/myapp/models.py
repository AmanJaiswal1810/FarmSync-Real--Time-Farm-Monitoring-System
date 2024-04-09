from django.db import models
from datetime import datetime
from django.utils import timezone
# Create your models here.
class IotData(models.Model):
    username = models.CharField(max_length =100)
    password = models.CharField(max_length =100, default = timezone.now)
    temperature = models.FloatField()
    pHValue = models.FloatField()
    turbidity = models.FloatField()
    dissolved_oxygen = models.FloatField()
    water_level_sensor = models.FloatField()
    moisture_sensor = models.FloatField()
    nitrogen = models.FloatField()
    phosphorous = models.FloatField()
    potassium = models.FloatField()
    unique_id = models.IntegerField(default='-1')
    location = models.CharField(max_length=100000, default='please enter location')
    created_at = models.DateTimeField(auto_now_add = True)

    def __str__(self) :
        return self.username
    
class Room(models.Model):
    name = models.CharField(max_length=1000)

class Message(models.Model):
    value = models.CharField(max_length=10000000)
    date = models.DateTimeField(default = datetime.now, blank = True)
    user = models.CharField(max_length=100)
    room = models.CharField(max_length=1000)

class post(models.Model):
    title = models.CharField(max_length=1000)
    body = models.CharField(max_length= 100000000)

class ContactFormSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject
    