from django.db import models


class Room(models.Model):
    id = models.AutoField(primary_key=True)
    owner_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.CharField(max_length=100, null=True)
    property_name = models.CharField(max_length=100)
    property_type = models.CharField(max_length=50)
    price = models.IntegerField()
    beds = models.IntegerField(null=True)
    room_no = models.CharField(max_length=50, null=True)
    floor = models.CharField(max_length=50, null=True)
    gender = models.CharField(max_length=20)
    room_type = models.CharField(max_length=50, null=True)
    sharing = models.CharField(max_length=50, null=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    wifi = models.BooleanField(default=False)
    food = models.BooleanField(default=False)
    ac = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    pool = models.BooleanField(default=False)
    gym = models.BooleanField(default=False)
    laundry = models.BooleanField(default=False)
    breakfast = models.BooleanField(default=False)
    dinner = models.BooleanField(default=False)
    no_smoking = models.BooleanField(default=False)
    no_alcohol = models.BooleanField(default=False)
    no_pets = models.BooleanField(default=False)
    attached_bathroom = models.BooleanField(default=False)
    balcony = models.BooleanField(default=False)
    eb_bill_extra = models.BooleanField(default=False)
    description = models.CharField(max_length=1000, null=True)

    class Meta:
        managed = False
        db_table = "rooms"

    def __str__(self):
        return self.property_name


class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, null=True)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, null=True)
    gender = models.CharField(max_length=20, null=True)
    dob = models.CharField(max_length=20, null=True)
    city = models.CharField(max_length=100, null=True)
    state = models.CharField(max_length=100, null=True)

    class Meta:
        managed = False
        db_table = "userstable"

    def __str__(self):
        return self.name


class Booking(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    property_name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    price = models.IntegerField()
    room_type = models.CharField(max_length=50)
    check_in = models.CharField(max_length=50)
    check_out = models.CharField(max_length=50, null=True)
    status = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = "bookings"

    def __str__(self):
        return self.property_name


class SavedRoom(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    property_id = models.IntegerField()
    property_name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    price = models.IntegerField()

    class Meta:
        managed = False
        db_table = "saved_rooms"

    def __str__(self):
        return self.property_name


class RoomImage(models.Model):
    id = models.AutoField(primary_key=True)
    
    room = models.ForeignKey(
        Room,
        db_column="room_id",
        on_delete=models.CASCADE,
        related_name="images")

    image_path = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = "room_images"

    def __str__(self):
        return self.image_path
