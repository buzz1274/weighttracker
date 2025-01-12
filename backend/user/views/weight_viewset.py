from rest_framework import viewsets

from user.models.weight import Weight

from ..serializers.weight_serializer import WeightSerializer


class WeightViewSet(viewsets.ModelViewSet):
    queryset = Weight.objects.filter(user_id=1).order_by("-date")
    serializer_class = WeightSerializer
    pagination_class = None

    def create(self, request, *args, **kwargs):
        pass

    def destroy(self, request, *args, **kwargs):
        pass
