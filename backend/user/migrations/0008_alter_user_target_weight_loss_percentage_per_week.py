# Generated by Django 5.1.4 on 2025-01-02 11:30

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_user_target_weight_loss_percentage_per_week'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='target_weight_loss_percentage_per_week',
            field=models.DecimalField(decimal_places=2, max_digits=3, null=True, validators=[django.core.validators.MinValueValidator(limit_value=0), django.core.validators.MaxValueValidator(limit_value=3)]),
        ),
    ]
