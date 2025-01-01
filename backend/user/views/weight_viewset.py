from rest_framework import viewsets
from rest_framework.response import Response

from ..models.weight import Weight
from ..serializers.weight_serializer import WeightSerializer


class WeightViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Weight.objects.filter(user_id=1).order_by("-date")
        serializer = WeightSerializer(queryset, many=True)

        return Response(serializer.data)
