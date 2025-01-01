from django.urls import path

# from .views.login import Login
from .views.weight_viewset import WeightViewSet

urlpatterns = [
    # path("login/", Login.as_view(), name="login"),
    path("weights/", WeightViewSet.as_view({"get": "list"}), name="weights")
]
