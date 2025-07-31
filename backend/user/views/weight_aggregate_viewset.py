from django.db.models import Avg, QuerySet
from django.db.models.functions import TruncMonth, TruncWeek, TruncYear
from rest_framework.permissions import IsAuthenticated

from user.models.weight import Weight
from user.serializers.weight_aggregate_serializer import (
    WeightAggregateSerializer,
)
from user.views.weight_viewset import WeightViewSet


class WeightAggregateViewSet(WeightViewSet):
    serializer_class = WeightAggregateSerializer
    pagination_class = None
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet:
        context = self.get_serializer_context()

        if context["frequency"] == "monthly":
            ag_date = TruncMonth("date")
        elif context["frequency"] == "weekly":
            ag_date = TruncWeek("date")
        else:
            ag_date = TruncYear("date")

        return (
            Weight.objects.filter(user_id=context["user_id"])
            .annotate(ag_date=ag_date)
            .values("ag_date")
            .annotate(ag_weight=Avg("weight_kg"))
            .values("ag_date", "ag_weight")
            .order_by("ag_date")
        )

    def get_serializer_context(self) -> dict:
        context = super().get_serializer_context()
        context["frequency"] = context.get("request").GET.get(
            "frequency", "daily"
        )

        return context
