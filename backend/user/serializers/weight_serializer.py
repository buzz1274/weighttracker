from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from user.models.weight import Weight


class WeightSerializer(serializers.ModelSerializer):
    DUPLICATE_WEIGHT_ERROR = "Weight already exists for this date."

    class Meta:
        model = Weight
        fields = ["id", "date", "weight_kg"]

    def validate(self, data) -> dict:
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

    def create(self, validated_data) -> Response:
        return Weight.objects.create(
            user_id=self.context["user_id"], **validated_data
        )
