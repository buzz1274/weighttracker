from datetime import date

from rest_framework import serializers

from user.models.user import User
from weighttracker.helpers.dates import Dates


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = [
            "password",
            "email",
            "id",
            "is_staff",
            "is_active",
            "sex",
            "is_superuser",
            "authentication_method",
            "groups",
            "user_permissions",
            "last_login",
            "username",
            "first_name",
            "last_name",
        ]

    name = serializers.SerializerMethodField("name_field")
    bmi_boundaries = serializers.SerializerMethodField("bmi_boundaries_field")
    max_weight_kg = serializers.SerializerMethodField("max_weight_kg_field")
    current_weight_kg = serializers.SerializerMethodField(
        "current_weight_kg_field"
    )
    date_joined = serializers.SerializerMethodField("date_joined_field")
    target_hit_date = serializers.SerializerMethodField(
        "target_hit_date_field"
    )
    current_bmi = serializers.SerializerMethodField("current_bmi_field")
    change_last_year_kg = serializers.SerializerMethodField(
        "change_last_year_kg_field"
    )
    change_last_month_kg = serializers.SerializerMethodField(
        "change_last_month_kg_field"
    )
    change_last_week_kg = serializers.SerializerMethodField(
        "change_last_week_kg_field"
    )
    average_weight_kg = serializers.SerializerMethodField(
        "average_weight_kg_field"
    )
    next_five_kg = serializers.SerializerMethodField("next_five_kg_field")
    next_five_kg_date = serializers.SerializerMethodField(
        "next_five_kg_date_field"
    )
    min_weight_kg = serializers.SerializerMethodField("min_weight_kg_field")

    def name_field(self, model):
        return str(model)

    def bmi_boundaries_field(self, model):
        return model.bmi_boundaries()

    def max_weight_kg_field(self, model):
        try:
            return f"{model.max_weight(True).weight_kg:.2f}"
        except AttributeError:
            return "-"

    def min_weight_kg_field(self, model):
        try:
            return f"{model.min_weight(True).weight_kg:.2f}"
        except AttributeError:
            return "-"

    def date_joined_field(self, model):
        return model.date_joined.date()

    def current_weight_kg_field(self, model):
        if current_weight := model.weight_at_date():
            return f"{current_weight.weight_kg:.2f}"

        return "-"

    def current_bmi_field(self, model):
        try:
            return f"{model.bmi():.2f}"
        except TypeError:
            return "-"

    def target_hit_date_field(self, model):
        return model.target_hit_date()

    def next_five_kg_field(self, model):
        if current_weight := model.weight_at_date():
            next_five_kg = 5 * round(current_weight.weight_kg / 5)

            if next_five_kg == current_weight.weight_kg:
                next_five_kg -= 5

            if next_five_kg - model.target_weight_kg > 5:
                return next_five_kg

        return "-"

    def next_five_kg_date_field(self, model):
        if (
            next_five_kg := self.next_five_kg_field(model)
        ) and next_five_kg != "-":
            return model.target_hit_date(next_five_kg)

        return "-"

    def change_last_year_kg_field(self, model):
        if year_change := model.change_between_dates(
            Dates().year_ago(), date.today()
        ):
            return f"{year_change:2f}"

        return "-"

    def change_last_month_kg_field(self, model):
        if month_change := model.change_between_dates(
            Dates().month_ago(), date.today()
        ):
            return f"{month_change:2f}"

        return "-"

    def change_last_week_kg_field(self, model):
        if week_change := model.change_between_dates(
            Dates().week_ago(), date.today()
        ):
            return f"{week_change:2f}"

        return "-"

    def average_weight_kg_field(self, model):
        return f"{model.average_weight():.2f}"
