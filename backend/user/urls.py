from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.LoginApi.as_view(), name="login"),
]
