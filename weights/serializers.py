from rest_framework import serializers

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
        return model.stats()

    class Meta:
        model = WeightUser

        fields = "__all__"
