from rest_framework import viewsets
from rest_framework.response import Response

from .queries.weight_history import WeightHistory
from .serializers import WeightSerializer


class WeightViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = WeightHistory().weight_history(1)
        serializer = WeightSerializer(queryset, many=True)

        return Response(serializer.data)
