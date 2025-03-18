from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response

from user.models.weight import Weight

from ..serializers.weight_serializer import WeightSerializer


class WeightViewSet(viewsets.ModelViewSet):
    serializer_class = WeightSerializer
    pagination_class = None

    def get_queryset(self) -> QuerySet:
        context = self.get_serializer_context()

        return Weight.objects.filter(user_id=context["user_id"]).order_by(
            "date"
        )

    def get_serializer_context(self) -> dict:
        context = super().get_serializer_context()
        context["user_id"] = 1

        return context

    def list(self, request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(self.get_queryset(), many=True)
        serialized_data = []
        previous_weight = None

        for d in serializer.data:
            d["weight_kg"] = float(d["weight_kg"])

            if previous_weight is not None:
                d[
                    "previous_weight_change_kg"
                ] = f"{(d['weight_kg'] - previous_weight):.2f}"
                d[
                    "previous_weight_change_percentage"
                ] = f"{(((d['weight_kg'] - previous_weight) / previous_weight) * 100):.2f}"
            else:
                d["previous_weight_change_kg"] = "-"
                d["previous_weight_change_percentage"] = "-"

            previous_weight = d["weight_kg"]
            d["weight_kg"] = f"{d['weight_kg']:.2f}"

            serialized_data.append(d)

        return Response(serialized_data)

    def destroy(self, request, *args, **kwargs):
        context = self.get_serializer_context()
        get_object_or_404(Weight, pk=kwargs["pk"], user_id=context["user_id"])

        return super().destroy(request, args, kwargs)

    def partial_update(self, request, *args, **kwargs):
        context = self.get_serializer_context()
        get_object_or_404(Weight, pk=kwargs["pk"], user_id=context["user_id"])

        return super().partial_update(request, *args, **kwargs)
