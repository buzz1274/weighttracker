"""
WSGI config for weighttracker project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

environment = os.environ.get("ENVIRONMENT", "PRODUCTION").lower()

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    f"weighttracker.settings.{environment}",
)

application = get_wsgi_application()
