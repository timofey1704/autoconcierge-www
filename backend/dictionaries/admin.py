from django.contrib import admin
from .models import *

@admin.register(Cities)
class CitiesAdmin(admin.ModelAdmin):
    list_display = ("name", "country")
    list_filter = ("name", "country")
    search_fields = ("name", "country")

@admin.register(Colors)
class ColorsAdmin(admin.ModelAdmin):
    list_display = ("name", "hex_code")
    search_fields = ("name", "hex_code")

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", )
    list_filter = ("name", )
    search_fields = ("name", )

@admin.register(Model)
class ModelAdmin(admin.ModelAdmin):
    list_display = ("name", "brand")
    list_filter = ("name", "brand")
    search_fields = ("name", "brand")

@admin.register(BodyType)
class BodyTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "model")
    search_fields = ("name", "model")
    list_filter = ("name", "model")