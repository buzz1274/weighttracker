from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from user.models.weight import Weight


class WeightSerializer(serializers.ModelSerializer):
    DUPLICATE_WEIGHT_ERROR = "Weight already exists for this date."

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

    def validate(self, data):
        data = super().validate(data)

        if not self.partial and Weight.objects.filter(
            user_id=self.context["user_id"], date=data["date"]
        ):
            raise ValidationError(
                {
                    "weight_kg": self.DUPLICATE_WEIGHT_ERROR,
                    "date": self.DUPLICATE_WEIGHT_ERROR,
                },
            )

        return data

    def create(self, validated_data):
        return Weight.objects.create(
            user_id=self.context["user_id"], **validated_data
        )

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
