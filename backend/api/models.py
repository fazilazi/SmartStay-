from django.db import models

# Create your models here.


class User(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    img_url= models.URLField(null=True)

    def __str__(self):
        return self.title
    
class Room(models.Model):
    name = models.CharField(max_length=70)
    price = models.IntegerField()
    location = models.CharField(max_length=100)