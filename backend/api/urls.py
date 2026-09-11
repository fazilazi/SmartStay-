from django.urls import path 
from .import views


urlpatterns=[
    path('',views.home),
    path('user/',views.users),
    path('user/<int:id>/',views.get_user),
    path('rooms/',views.get_rooms)
]