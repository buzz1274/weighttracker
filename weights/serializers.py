from datetime import date

from rest_framework import serializers

from weighttracker.helpers.dates import Dates

from .models.weight import Weight
from .models.weight_user import WeightUser


class WeightSerializer(serializers.ModelSerializer):
    week_weight_change_kg = serializers.SerializerMethodField(
        "week_weight_change_kg_field"
    )

    class Meta:
        model = Weight
        fields = ["id", "date", "weight_kg", "week_weight_change_kg"]

    def week_weight_change_kg_field(self, model):
        return (
            "-"
            if model.week_weight_change_kg is None
            else f"{model.week_weight_change_kg:.2f}"
        )


class WeightUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField("name_field")
    email = serializers.SerializerMethodField("email_field")
    bmi_boundaries = serializers.SerializerMethodField("bmi_boundaries_field")
    stats = serializers.SerializerMethodField("stats_field")
    max_weight_kg = serializers.SerializerMethodField("max_weight_kg_field")
    current_weight_kg = serializers.SerializerMethodField(
        "current_weight_kg_field"
    )
    target_hit_date = serializers.SerializerMethodField(
        "target_hit_date_field"
    )
    current_bmi = serializers.SerializerMethodField("current_bmi_field")

    def name_field(self, model):
        return model.user.username

    def email_field(self, model):
        return model.user.email

    def bmi_boundaries_field(self, model):
        return model.bmi_boundaries()

    def max_weight_kg_field(self, model):
        try:
            return f"{model.max_weight().weight_kg:.2f}"
        except AttributeError:
            return "-"

    def current_weight_kg_field(self, model):
        try:
            return f"{model.current_weight().weight_kg:.2f}"
        except AttributeError:
            return "-"

    def current_bmi_field(self, model):
        try:
            return f"{model.bmi():.2f}"
        except TypeError:
            return "-"

    def target_hit_date_field(self, model):
        return model.target_hit_date()

    def stats_field(self, model):
        year_change = model.weight_at_date(Dates().year_ago())
        year_change = f"{year_change.weight_kg:2f}" if year_change else "-"

        month_change = model.change_between_dates(
            Dates().month_ago(), date.today()
        )
        month_change = f"{month_change:2f}" if month_change else "-"

        week_change = model.weight_at_date(Dates().week_ago())
        week_change = f"{week_change.weight_kg:2f}" if week_change else "-"

        return {
            "average_weight_kg": f"{model.average_weight():.2f}",
            "min_weight_kg": f"{model.min_weight():.2f}",
            "change_last_year_kg": year_change,
            "change_last_month_kg": month_change,
            "change_last_week_kg": week_change,
        }

    class Meta:
        model = WeightUser
        fields = "__all__"
