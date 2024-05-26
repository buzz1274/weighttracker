from django.contrib import admin

from .models.user import User


class UserAdmin(admin.ModelAdmin):
    list_display = ["email"]
    list_filter = ["email"]


admin.site.register(User, UserAdmin)
