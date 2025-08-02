from django.urls import path

from user.views.authentication_views import Login, Logout
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

user_set_view = UserViewSet.as_view(
    {
        "get": "retrieve",
        "put": "partial_update",
    }
)

urlpatterns = [
    path("login/", Login.as_view(), name="login"),
    path("logout/", Logout.as_view(), name="logout"),
    path("weights/aggregate/", weight_aggregate_set_view, name="weights"),
    path("weights/", weight_set_view, name="weights"),
    path("weights/<int:pk>", weight_set_view, name="weights"),
    path("", user_set_view, name="user"),
    path("<int:pk>", user_set_view, name="user"),
]
