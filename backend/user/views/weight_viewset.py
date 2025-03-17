from django.db.models import Avg
from django.db.models.functions import TruncDay, TruncMonth, TruncWeek
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response

from user.models.weight import Weight

from ..serializers.weight_serializer import WeightSerializer


class WeightViewSet(viewsets.ModelViewSet):
    serializer_class = WeightSerializer
    pagination_class = None

    def get_queryset(self):
        context = self.get_serializer_context()

        if context["frequency"] == "monthly":
            month_date = TruncMonth("date")
        elif context["frequency"] == "weekly":
            month_date = TruncWeek("date")
        else:
            month_date = TruncDay("date")

        return (
            Weight.objects.filter(user_id=context["user_id"])
            .annotate(month_date=month_date)
            .values("month_date")
            .annotate(weight=Avg("weight_kg"))
            .values("month_date", "weight")
            .order_by("month_date")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["user_id"] = 1
        context["frequency"] = context.get("request").GET.get(
            "frequency", "weekly"
        )

        return context

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        serialized_data = []
        previous_weight = None

        for d in serializer.data:
            if previous_weight is not None:
                d[
                    "week_weight_change_kg"
                ] = f"{(d['weight_kg'] - previous_weight):.2f}"
                d[
                    "week_weight_change_percentage"
                ] = f"{(((d['weight_kg'] - previous_weight) / previous_weight) * 100):.2f}"
            else:
                d["week_weight_change_kg"] = "-"
                d["week_weight_change_percentage_field"] = "-"

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
