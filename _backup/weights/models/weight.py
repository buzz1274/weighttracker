import decimal
from datetime import timedelta

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import DateField, DecimalField


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
        """save weight model"""
        self._update_weeks_weight_change()
        super(Weight, self).save(*args, **kwargs)
        self._update_weeks_weight_change_for_newer_weight()

    def _update_weeks_weight_change(self):
        """update the weeks weight change for submitted weight"""
        weight = self.user.weight_at_date(self.date - timedelta(days=7))

        if weight:
            week_weight_change_kg = decimal.Decimal(self.weight_kg - weight.weight_kg)

            if week_weight_change_kg != self.week_weight_change_kg:
                self.week_weight_change_kg = week_weight_change_kg

    def _update_weeks_weight_change_for_newer_weight(self):
        """update the weeks weight change for weight 7 days in advance"""
        weight = self.user.weight_at_date(self.date + timedelta(days=7))

        if weight:
            week_weight_change_kg = decimal.Decimal(weight.weight_kg - self.weight_kg)

            if week_weight_change_kg != weight.week_weight_change_kg:
                weight.week_weight_change_kg = week_weight_change_kg
                weight.save()
