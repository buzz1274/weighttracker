from rest_framework import serializers

from weighttracker.helpers.dates import Dates

from .models import Weight, WeightUser


class WeightSerializer(serializers.ModelSerializer):
    change = serializers.SerializerMethodField("change_field")

    def change_field(self, model):
        return model.change

    class Meta:
        model = Weight

        fields = ["id", "date", "weight", "change"]


class WeightUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField("name_field")
    email = serializers.SerializerMethodField("email_field")
    bmi_boundaries = serializers.SerializerMethodField("bmi_boundaries_field")
    stats = serializers.SerializerMethodField("stats_field")

    def name_field(self, model):
        return model.user.username

    def email_field(self, model):
        return model.user.email

    def bmi_boundaries_field(self, model):
        return model.bmi_boundaries()

    def stats_field(self, model):
        year_change = model.weight_change_since(Dates().year_ago())
        year_change = f"{year_change:2f}" if year_change else "-"

        month_change = model.weight_change_since(Dates().month_ago())
        month_change = f"{month_change:2f}" if month_change else "-"

        week_change = model.weight_change_since(Dates().week_ago())
        week_change = f"{week_change:2f}" if week_change else "-"

        return {
            "current_weight": f"{model.current_weight():.2f}",
            "average_weight_kg": f"{model.average_weight():.2f}",
            "max_weight_kg": f"{model.max_weight():.2f}",
            "min_weight_kg": f"{model.min_weight():.2f}",
            "current_bmi": f"{model.bmi():.2f}",
            "change_last_year_kg": year_change,
            "change_last_month_kg": month_change,
            "change_last_week_kg": week_change,
        }

    class Meta:
        model = WeightUser

        fields = "__all__"
