from rest_framework import viewsets
from rest_framework.response import Response

from .models.weight import Weight
from .models.weight_user import WeightUser
from .serializers import WeightSerializer, WeightUserSerializer


class WeightViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Weight.objects.filter(user_id=1).order_by("-date")
        serializer = WeightSerializer(queryset, many=True)

        return Response(serializer.data)


class WeightUserViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk):
        queryset = (
            WeightUser.objects.select_related("user").filter(user_id=1).get()
        )
        serializer = WeightUserSerializer(queryset)

        return Response(serializer.data)
