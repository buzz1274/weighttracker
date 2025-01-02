from django.urls import path

from user.views.login import Login
from user.views.user_viewset import UserViewSet
from user.views.weight_viewset import WeightViewSet

urlpatterns = [
    path("login/", Login.as_view(), name="login"),
    path("weights/", WeightViewSet.as_view({"get": "list"}), name="weights"),
    path("", UserViewSet.as_view({"get": "retrieve"}), name="user"),
]
