from django.urls import path
from .  import views
urlpatterns = [
    path('',views.index, name='index'),
    path('login', views.login, name = 'login'),
    path('logout',views.logout, name='logout'),
    path('home', views.home, name='home' ),
    path('checkview/<str:username>/', views.checkview, name='checkview'),
    path('<str:room>/', views.room, name='room'), 
    path('send', views.send, name ='send'),
    path('getMessages/<str:room>/', views.getMessages, name='getMessages'),
    path('blogs', views.blogs, name='blogs'),
    path('Posts/<str:postk>', views.Posts, name='Posts'),
    path('result/<str:username>/', views.result, name='result'),
    path('soilresult/<str:username>/', views.soilresult, name ='soilresult'),
    path('SendEmail', views.SendEmail, name='SendEmail'),
]
