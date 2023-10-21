from django.db import models
from django.conf import settings
from django.db.models import DateField, DecimalField




class Weight(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    date = DateField()
    weight = DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        ordering = ('-date',)    
