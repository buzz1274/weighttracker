from rest_framework import serializers

from user.models.user import User


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "sex",
            "height_m",
            "starting_weight_kg",
            "weight_loss_start_date",
            "target_weight_kg",
            "intermediate_loss_target_kg",
            "weight_loss_at_date",
            "target_weight_loss_percentage_per_week",
        ]
