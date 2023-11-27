import decimal

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Avg, DateField, DecimalField


class WeightUser(models.Model):
    BMI_RANGES = {
        "OBESE": decimal.Decimal(30),
        "OVERWEIGHT": decimal.Decimal(25),
        "NORMAL": decimal.Decimal(18.5),
    }
    SEX_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    height_m = DecimalField(max_digits=3, decimal_places=2)
    starting_weight_kg = DecimalField(max_digits=5, decimal_places=2)
    target_weight_kg = DecimalField(max_digits=5, decimal_places=2)
    sex = models.CharField(
        max_length=2,
        choices=SEX_CHOICES,
    )

    def bmi_boundaries(self):
        return {
            "obese": round(
                (self.height_m * self.height_m) * self.BMI_RANGES["OBESE"], 1
            ),
            "overweight": round(
                (self.height_m * self.height_m)
                * self.BMI_RANGES["OVERWEIGHT"],
                1,
            ),
            "normal": round(
                (self.height_m * self.height_m) * self.BMI_RANGES["NORMAL"], 1
            ),
        }

    def current_weight(self):
        """get users current weight"""
        try:
            return (
                Weight.objects.filter(user=self.user)
                .order_by("-date")[0]
                .weight
            )
        except IndexError:
            return 0.0

    def average_weight(self):
        """get average weight for user"""
        try:
            return round(
                Weight.objects.filter(user=self.user).aggregate(Avg("weight"))[
                    "weight__avg"
                ],
                1,
            )
        except KeyError:
            return 0.0

    def max_weight(self):
        """get average weight for user"""
        try:
            return (
                Weight.objects.filter(user=self.user)
                .order_by("-weight")[0]
                .weight
            )
        except IndexError:
            return 0.0

    def stats(self):
        return {
            "current_weight": self.current_weight(),
            "average_weight_kg": self.average_weight(),
            "max_weight_kg": self.max_weight(),
        }


class Weight(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    date = DateField()
    weight = DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        ordering = ("-date",)
