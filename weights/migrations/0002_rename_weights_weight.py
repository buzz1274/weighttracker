# Generated by Django 4.2.6 on 2023-10-21 11:50

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('weights', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Weights',
            new_name='Weight',
        ),
    ]
