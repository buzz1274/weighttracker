from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import DateField, DecimalField


class Weight(models.Model):
    class Meta:
        ordering = ("-date",)
        unique_together = (
            "user",
            "date",
        )

    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="user",
    )
    date = DateField()
    weight_kg = DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(limit_value=30)],
    )
