from rest_framework import viewsets
from rest_framework.response import Response

from .models import WeightUser
from .queries.weight_history import WeightHistory
from .serializers import WeightSerializer, WeightUserSerializer


class WeightViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = WeightHistory().weight_history(1)
        serializer = WeightSerializer(queryset, many=True)

        return Response(serializer.data)


class WeightUserViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk):
        queryset = (
            WeightUser.objects.select_related("user").filter(user_id=1).get()
        )
        serializer = WeightUserSerializer(queryset)

        return Response(serializer.data)
