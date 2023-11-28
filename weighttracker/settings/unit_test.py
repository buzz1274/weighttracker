import os

from .production import *  # noqa: F403, F401

DEBUG = True
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.environ["DB_NAME"],
    },
}
