from django.urls import path

from user.views.login import Login
from user.views.user_viewset import UserViewSet
from user.views.weight_aggregate_viewset import WeightAggregateViewSet
from user.views.weight_viewset import WeightViewSet

weight_set_view = WeightViewSet.as_view(
    {
        "get": "list",
        "post": "create",
        "delete": "destroy",
        "put": "partial_update",
    }
)

weight_aggregate_set_view = WeightAggregateViewSet.as_view(
    {
        "get": "list",
    }
)

urlpatterns = [
    path("login/", Login.as_view(), name="login"),
    path("weights/aggregate/", weight_aggregate_set_view, name="weights"),
    path("weights/", weight_set_view, name="weights"),
    path("weights/<int:pk>", weight_set_view, name="weights"),
    path("", UserViewSet.as_view({"get": "retrieve"}), name="user"),
]
