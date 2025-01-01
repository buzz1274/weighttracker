from rest_framework import viewsets
from rest_framework.response import Response

from ..models.user import User
from ..serializers.weight_summary_serializer import WeightSummarySerializer


class WeightSummaryViewSet(viewsets.ViewSet):
    def retrieve(self, request):
        queryset = User.objects.filter(pk=1).get()
        serializer = WeightSummarySerializer(queryset)

        return Response(serializer.data)
