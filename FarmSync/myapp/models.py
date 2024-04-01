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
    created_at = models.DateTimeField(auto_now_add = True)
    