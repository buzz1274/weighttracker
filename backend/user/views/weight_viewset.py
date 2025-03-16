from django.shortcuts import get_object_or_404
from rest_framework import viewsets

from user.models.weight import Weight

from ..serializers.weight_serializer import WeightSerializer


class WeightViewSet(viewsets.ModelViewSet):
    queryset = Weight.objects.filter(user_id=1).order_by("-date")
    serializer_class = WeightSerializer
    pagination_class = None

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["user_id"] = 1

        return context

    def destroy(self, request, *args, **kwargs):
        context = self.get_serializer_context()
        get_object_or_404(Weight, pk=kwargs["pk"], user_id=context["user_id"])

        return super().destroy(request, args, kwargs)

    def partial_update(self, request, *args, **kwargs):
        context = self.get_serializer_context()
        get_object_or_404(Weight, pk=kwargs["pk"], user_id=context["user_id"])

        return super().partial_update(request, *args, **kwargs)
