from rest_framework import serializers

from user.models.weight import Weight


class WeightSerializer(serializers.ModelSerializer):
    week_weight_change_kg = serializers.SerializerMethodField(
        "week_weight_change_kg_field"
    )

    week_weight_change_percentage = serializers.SerializerMethodField(
        "week_weight_change_percentage_field"
    )

    class Meta:
        model = Weight
        fields = [
            "id",
            "date",
            "weight_kg",
            "week_weight_change_kg",
            "week_weight_change_percentage",
        ]

    def week_weight_change_kg_field(self, model):
        return (
            "-"
            if model.week_weight_change_kg is None
            else f"{model.week_weight_change_kg:.2f}"
        )

    def week_weight_change_percentage_field(self, model):
        return (
            "-"
            if model.week_weight_change_percentage is None
            else f"{model.week_weight_change_percentage:.2f}"
        )
