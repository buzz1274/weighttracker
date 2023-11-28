import decimal
import math
from datetime import date, timedelta
from typing import Union

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Avg, DateField, DecimalField


class Weight(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    date = DateField()
    weight = DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        ordering = ("-date",)


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

    def bmi_boundaries(self) -> dict:
        """calculate bmi boundaries for current user"""
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

    def current_weight(self) -> Weight:
        """get users current weight"""
        return Weight.objects.filter(user=self.user).order_by("-date").first()

    def max_weight(self) -> Weight:
        """get average weight for user"""
        return (
            Weight.objects.filter(user=self.user)
            .order_by("-weight", "-date")
            .first()
        )

    def min_weight(self) -> decimal.Decimal:
        """get average weight for user"""
        try:
            return decimal.Decimal(
                Weight.objects.filter(user=self.user)
                .order_by("weight")[0]
                .weight
            )
        except IndexError:
            return decimal.Decimal(0.00)

    def average_weight(self) -> decimal.Decimal:
        """get average weight for user"""
        try:
            return decimal.Decimal(
                Weight.objects.filter(user=self.user).aggregate(Avg("weight"))[
                    "weight__avg"
                ]
            )
        except KeyError:
            return decimal.Decimal(0.00)

    def bmi(self) -> Union[None, decimal.Decimal]:
        """calculate users bmi"""
        try:
            return decimal.Decimal(
                self.current_weight().weight / (self.height_m * self.height_m)
            )
        except (ZeroDivisionError, AttributeError):
            return None

    def target_hit_date(self):
        """determine approx date to hit weight target"""
        try:
            max_weight = self.max_weight()
            current_weight = self.current_weight()

            days_to_target = math.ceil(
                (current_weight.weight - self.target_weight_kg)
                / (
                    (max_weight.weight - current_weight.weight)
                    / (current_weight.date - max_weight.date).days
                )
            )

            return date.today() + timedelta(days=days_to_target)

        except (ZeroDivisionError, AttributeError):
            return None

    def weight_change_since(
        self, search_date: date, days_leeway: Union[int, None] = 2
    ) -> Union[None, decimal.Decimal]:
        """determine weight change since supplied date"""
        greater_than_date = (
            Weight.objects.filter(user=self.user, date__gte=search_date)
            .order_by("date")
            .first()
        )
        greater_than_date_diff = None

        if greater_than_date:
            if greater_than_date.date == search_date:
                return decimal.Decimal(
                    self.current_weight().weight - greater_than_date.weight
                )
            else:
                greater_than_date_diff = (
                    greater_than_date.date - search_date
                ).days

        less_than_date = (
            Weight.objects.filter(user=self.user, date__lte=search_date)
            .order_by("-date")
            .first()
        )
        less_than_date_diff = None

        if less_than_date:
            less_than_date_diff = (search_date - less_than_date.date).days

        if (
            less_than_date_diff
            and less_than_date_diff <= days_leeway
            and (
                greater_than_date_diff is None
                or less_than_date_diff <= greater_than_date_diff
            )
        ):
            return decimal.Decimal(
                self.current_weight().weight - less_than_date.weight
            )
        elif greater_than_date_diff and greater_than_date_diff <= days_leeway:
            return decimal.Decimal(
                self.current_weight().weight - greater_than_date.weight
            )

        return None
