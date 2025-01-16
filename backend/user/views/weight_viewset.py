from django.conf import settings
from rest_framework import viewsets

from user.models.weight import Weight

from ..serializers.weight_serializer import WeightSerializer


class WeightViewSet(viewsets.ModelViewSet):
    queryset = Weight.objects.filter(user_id=settings.USER_ID).order_by(
        "-date"
    )
    serializer_class = WeightSerializer
    pagination_class = None

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["user_id"] = 1

        return context
