from rest_framework import serializers


class WeightAggregateSerializer(serializers.BaseSerializer):
    def to_representation(self, instance) -> dict:
        return {
            "date": instance["ag_date"],
            "weight_kg": instance["ag_weight"],
        }
