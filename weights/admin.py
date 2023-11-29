from django.contrib import admin

from .models.weight import Weight
from .models.weight_user import WeightUser


class WeightUserAdmin(admin.ModelAdmin):
    list_display = ["user"]
    list_filter = ["user"]


admin.site.register(WeightUser, WeightUserAdmin)


class WeightAdmin(admin.ModelAdmin):
    list_display = ["date", "user", "weight_kg", "week_weight_change_kg"]
    list_filter = ["user"]
    fields = ["date", "user", "weight_kg"]


admin.site.register(Weight, WeightAdmin)
