import decimal
import math
from datetime import date, timedelta
from typing import Union

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Avg, DecimalField

from .weight import Weight


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

    def __str__(self):
        return self.user.username

    def bmi_boundaries(self) -> dict:
        """calculate bmi boundaries for current user"""
        return {
            "obese": round(
                self._height_squared() * self.BMI_RANGES["OBESE"], 1
            ),
            "overweight": round(
                self._height_squared() * self.BMI_RANGES["OVERWEIGHT"], 1
            ),
            "normal": round(
                self._height_squared() * self.BMI_RANGES["NORMAL"], 1
            ),
        }

    def max_weight(self) -> Weight:
        """get average weight for user"""
        return (
            Weight.objects.filter(user=self)
            .order_by("-weight_kg", "-date")
            .first()
        )

    def min_weight(self) -> decimal.Decimal:
        """get average weight for user"""
        try:
            return decimal.Decimal(
                Weight.objects.filter(user=self)
                .order_by("weight_kg")[0]
                .weight_kg
            )
        except IndexError:
            return decimal.Decimal(0.00)

    def average_weight(self) -> decimal.Decimal:
        """get average weight for user"""
        try:
            return decimal.Decimal(
                Weight.objects.filter(user=self).aggregate(Avg("weight_kg"))[
                    "weight_kg__avg"
                ]
            )
        except KeyError:
            return decimal.Decimal(0.00)

    def bmi(self) -> Union[None, decimal.Decimal]:
        """calculate users bmi"""
        try:
            return decimal.Decimal(
                round(
                    self.weight_at_date().weight_kg / self._height_squared(), 2
                )
            )
        except (ZeroDivisionError, AttributeError):
            return None

    def target_hit_date(self) -> Union[None, date]:
        """determine approx date to hit weight target"""
        try:
            max_weight = self.starting_weight_kg
            current_weight = self.weight_at_date()

            days_to_target = math.ceil(
                (current_weight.weight_kg - self.target_weight_kg)
                / (
                    (max_weight.weight_kg - current_weight.weight_kg)
                    / (current_weight.date - max_weight.date).days
                )
            )

            return date.today() + timedelta(days=days_to_target)

        except (ZeroDivisionError, AttributeError):
            return None

    def weight_at_date(self, search_date: Union[None, date] = None) -> Weight:
        """determine weight change since supplied date"""
        if not search_date:
            search_date = date.today()

        return Weight.objects.filter(user=self, date=search_date).first()

    def change_between_dates(
        self, from_date: date, to_date: date
    ) -> Union[None, decimal.Decimal]:
        """determine weight change between dates"""
        from_weight = self.weight_at_date(from_date)
        to_weight = self.weight_at_date(to_date)

        if from_weight and to_weight:
            return from_weight.weight_kg - to_weight.weight_kg

        return None

    def _height_squared(self) -> decimal.Decimal:
        """square users height"""
        return decimal.Decimal(self.height_m * self.height_m)
