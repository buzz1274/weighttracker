import decimal
import math
from datetime import date, timedelta
from typing import Union

from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Avg, DateField, DecimalField


class Weight(models.Model):
    user = models.ForeignKey(
        "WeightUser",
        on_delete=models.CASCADE,
        related_name="weight_user",
    )
    date = DateField()
    weight_kg = DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(limit_value=30)],
    )
    week_weight_change_kg = DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        validators=[
            MinValueValidator(limit_value=-6),
            MaxValueValidator(limit_value=6),
        ],
    )

    class Meta:
        ordering = ("-date",)
        unique_together = (
            "user",
            "date",
        )

    def save(self, *args, **kwargs):
        self._update_weeks_weight_change()
        super(Weight, self).save(*args, **kwargs)
        self._update_weeks_weight_change_for_newer_weight()

    def _update_weeks_weight_change(self):
        """update the weeks weight change for submitted weight"""
        if self.pk is None or self.week_weight_change_kg is None:
            self.week_weight_change_kg = self.user.weight_change_since(
                self.date - timedelta(days=7), 0
            )

    def _update_weeks_weight_change_for_newer_weight(self):
        """update the weeks weight change for weight 7 days in advance"""
        weight = Weight.objects.filter(
            user_id=self.user.pk, date=(self.date + timedelta(days=7))
        ).first()

        if weight:
            week_weight_change_kg = decimal.Decimal(
                weight.weight_kg - self.weight_kg
            )

            if week_weight_change_kg != weight.week_weight_change_kg:
                weight.week_weight_change_kg = week_weight_change_kg
                weight.save()


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

    def current_weight(self) -> Weight:
        """get users current weight"""
        return Weight.objects.filter(user=self).order_by("-date").first()

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
                    self.current_weight().weight_kg / self._height_squared(), 2
                )
            )
        except (ZeroDivisionError, AttributeError):
            return None

    def target_hit_date(self):
        """determine approx date to hit weight target"""
        try:
            max_weight = self.max_weight()
            current_weight = self.current_weight()

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

    def weight_change_since(
        self, search_date: date, days_leeway: Union[int, None] = 2
    ) -> Union[None, decimal.Decimal]:
        """determine weight change since supplied date"""
        greater_than_date = (
            Weight.objects.filter(user=self, date__gte=search_date)
            .order_by("date")
            .first()
        )
        greater_than_date_diff = None

        if greater_than_date:
            if greater_than_date.date == search_date:
                return decimal.Decimal(
                    self.current_weight().weight_kg
                    - greater_than_date.weight_kg
                )
            else:
                greater_than_date_diff = (
                    greater_than_date.date - search_date
                ).days

        less_than_date = (
            Weight.objects.filter(user=self, date__lte=search_date)
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
                self.current_weight().weight_kg - less_than_date.weight_kg
            )
        elif greater_than_date_diff and greater_than_date_diff <= days_leeway:
            return decimal.Decimal(
                self.current_weight().weight_kg - greater_than_date.weight_kg
            )

        return None

    def _height_squared(self) -> decimal.Decimal:
        """square users height"""
        return decimal.Decimal(self.height_m * self.height_m)
