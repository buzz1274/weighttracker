from django.contrib import admin

from user.models.user import User
from user.models.weight import Weight


class UserAdmin(admin.ModelAdmin):
    list_display = ["username"]
    list_filter = ["username"]


admin.site.register(User, UserAdmin)


class WeightAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "date",
        "weight_kg",
    ]
    list_filter = ["user"]


admin.site.register(Weight, WeightAdmin)
