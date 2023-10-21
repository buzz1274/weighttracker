from django.contrib import admin
from weights.models import Weight

class WeightAdmin(admin.ModelAdmin):
    list_display = ["date", "user", "weight"]
    list_filter = ["user__first_name"]


admin.site.register(Weight, WeightAdmin)