from django.http import JsonResponse
from .models import Room


def home(request):
    return JsonResponse({ "Mess": "Vaagana Oombugana "}) 

def users(request):
    user=[
        {"id":1, "name":"Fazil"},
        {"id":2, "name":"John"},
    ]
    return JsonResponse(user, safe=False)

def get_user(request, id):
    useer = {"id": id , "name":"Fazil"}
    return JsonResponse(useer)

def get_rooms(request):
    rooms=Room.objects.all()
    data=list(rooms.values())
    return JsonResponse(data, safe=False)

