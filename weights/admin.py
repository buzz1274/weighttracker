from django.contrib import admin

from weights.models import Weight, WeightUser


class WeightUserAdmin(admin.ModelAdmin):
    list_display = ["user"]
    list_filter = ["user"]


admin.site.register(WeightUser, WeightUserAdmin)


class WeightAdmin(admin.ModelAdmin):
    list_display = ["date", "user", "weight"]
    list_filter = ["user"]


admin.site.register(Weight, WeightAdmin)
