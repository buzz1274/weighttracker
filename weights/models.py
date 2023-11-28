import decimal
from datetime import date
from typing import Union

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

    def current_weight(self) -> decimal.Decimal:
        """get users current weight"""
        try:
            return decimal.Decimal(
                Weight.objects.filter(user=self.user)
                .order_by("-date")[0]
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

    def max_weight(self) -> decimal.Decimal:
        """get average weight for user"""
        try:
            return decimal.Decimal(
                Weight.objects.filter(user=self.user)
                .order_by("-weight", "-date")[0]
                .weight
            )
        except IndexError:
            return decimal.Decimal(0.00)

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

    def bmi(self) -> decimal.Decimal:
        """calculate users bmi"""
        try:
            return decimal.Decimal(
                self.current_weight() / (self.height_m * self.height_m)
            )
        except ZeroDivisionError:
            return decimal.Decimal(0.00)

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
                    self.current_weight() - greater_than_date.weight
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
                self.current_weight() - less_than_date.weight
            )
        elif greater_than_date_diff and greater_than_date_diff <= days_leeway:
            return decimal.Decimal(
                self.current_weight() - greater_than_date.weight
            )

        return None


class Weight(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    date = DateField()
    weight = DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        ordering = ("-date",)
