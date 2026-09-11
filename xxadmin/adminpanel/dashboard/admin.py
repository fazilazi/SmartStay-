import os
from django.contrib import admin
from .models import Room, User, Booking, SavedRoom, RoomImage


class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 0

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "property_name",
        "owner_name",
        "city",
        "property_type",
        "price",
    )

    search_fields = (
        "property_name",
        "owner_name",
        "city",
    )

    list_filter = (
        "property_type",
        "city",
    )

    inlines = [RoomImageInline]

    def delete_model(self, request, obj):
        images = RoomImage.objects.filter(room=obj)

        for image in images:
            if image.image_path and os.path.isfile(image.image_path):
                try:
                    os.remove(image.image_path)
                except OSError:
                    pass

        obj.delete()

    def delete_queryset(self, request, queryset):
        for room in queryset:
            images = RoomImage.objects.filter(room=room)

            for image in images:
                if image.image_path and os.path.isfile(image.image_path):
                    try:
                        os.remove(image.image_path)
                    except OSError:
                        pass

        queryset.delete()
  

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "phone",
        "city",
        "state",
    )

    search_fields = (
        "name",
        "email",
        "phone",
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "property_name",
        "user_id",
        "price",
        "room_type",
        "status",
    )

    search_fields = (
        "property_name",
        "location",
    )

    list_filter = (
        "status",
        "room_type",
    )


@admin.register(SavedRoom)
class SavedRoomAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_id",
        "property_id",
        "property_name",
        "location",
        "price",
    )

    search_fields = (
        "property_name",
        "location",
    )


@admin.register(RoomImage)
class RoomImageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "room_id",
        "image_path",
    )

    search_fields = (
        "image_path",
    )