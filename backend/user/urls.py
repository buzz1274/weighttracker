from django.urls import path

from .views.weight_summary_viewset import WeightSummaryViewSet

# from .views.login import Login
from .views.weight_viewset import WeightViewSet

urlpatterns = [
    # path("login/", Login.as_view(), name="login"),
    path("weights/", WeightViewSet.as_view({"get": "list"}), name="weights"),
    path("/", WeightSummaryViewSet.as_view({"get": "retrieve"}), name="weight_summary"),
]
