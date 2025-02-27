import decimal
import math
from datetime import date, timedelta
from typing import Optional

from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Avg, DateField, DecimalField

from user.models.weight import Weight


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
    target_weight_loss_percentage_per_week = DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        validators=[
            MinValueValidator(limit_value=decimal.Decimal(0)),
            MaxValueValidator(limit_value=decimal.Decimal(3)),
        ],
    )
    weight_loss_start_date = models.DateField(null=True)

    def __str__(self):
        return self.username

    def weight_at_date(
        self, search_date: Optional[date | DateField] = None
    ) -> Weight:
        """
        determine weight change since supplied date
        """
        if not search_date:
            search_date = date.today()

        if (
            weight := Weight.objects.filter(
                user=self, date=search_date
            ).first()
        ) or search_date != date.today():
            return weight
        else:
            return Weight.objects.filter(user=self).order_by("-date").first()

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

    def _height_squared(self) -> decimal.Decimal:
        """square users height"""
        return decimal.Decimal(self.height_m * self.height_m)

    def max_weight(self, from_weight_loss_start: bool = False) -> Weight:
        """get average weight for user"""
        query = Weight.objects.filter(user=self)

        if from_weight_loss_start and self.weight_loss_start_date:
            query = query.filter(date__gte=self.weight_loss_start_date)

        return query.order_by("-weight_kg", "-date").first()

    def min_weight(self, from_weight_loss_start: bool = False) -> Weight:
        """get average weight for user"""
        query = Weight.objects.filter(user=self)

        if from_weight_loss_start and self.weight_loss_start_date:
            query = query.filter(date__gte=self.weight_loss_start_date)

        return query.order_by("weight_kg").first()

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

    def bmi(self) -> decimal.Decimal | None:
        """calculate users bmi"""
        try:
            return decimal.Decimal(
                round(
                    self.weight_at_date().weight_kg / self._height_squared(),
                    2,
                )
            )
        except (ZeroDivisionError, AttributeError):
            return None

    def target_hit_date(
        self, target_weight_kg: Optional[int] = None
    ) -> date | None:
        """determine approx date to hit weight target"""
        try:
            if not target_weight_kg:
                target_weight_kg = self.target_weight_kg

            weight_at_start = self.weight_at_date(self.weight_loss_start_date)
            current_weight = self.weight_at_date()

            days_to_target = math.ceil(
                (current_weight.weight_kg - target_weight_kg)
                / (
                    (weight_at_start.weight_kg - current_weight.weight_kg)
                    / (current_weight.date - weight_at_start.date).days
                )
            )

            return date.today() + timedelta(days=days_to_target)

        except (ZeroDivisionError, AttributeError, decimal.InvalidOperation):
            return None

    def change_between_dates(
        self, from_date: date, to_date: date
    ) -> decimal.Decimal | None:
        """determine weight change between dates"""
        from_weight = self.weight_at_date(from_date)
        to_weight = self.weight_at_date(to_date)

        if from_weight and to_weight:
            return to_weight.weight_kg - from_weight.weight_kg

        return None
