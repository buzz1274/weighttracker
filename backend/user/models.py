import decimal

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import DecimalField


class User(AbstractUser):
    BMI_RANGES = {
        "OBESE": decimal.Decimal(30),
        "OVERWEIGHT": decimal.Decimal(25),
        "NORMAL": decimal.Decimal(18.5),
    }
    SEX_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
    ]
    AUTHENTICATION_METHOD = [
        ("google", "Google"),
    ]

    height_m = DecimalField(
        max_digits=3, decimal_places=2, blank=True, null=True
    )
    starting_weight_kg = DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True
    )
    target_weight_kg = DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True
    )
    sex = models.CharField(
        max_length=2,
        choices=SEX_CHOICES,
        blank=True,
    )
    authentication_method = models.CharField(
        max_length=6,
        choices=AUTHENTICATION_METHOD,
    )
