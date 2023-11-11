from rest_framework import serializers

from .models import Weight


class WeightSerializer(serializers.ModelSerializer):
    change = serializers.SerializerMethodField("change_field")

    def change_field(self, model):
        return model.change

    class Meta:
        model = Weight

        fields = ["id", "date", "weight", "change"]
