from django.urls import path
from . import views
urlpatterns=[
    path('chat/<str:username>/',views.chatbot,name='chatbot'),
    path('analysis/<str:username>/',views.analysis,name='analysis'),
]