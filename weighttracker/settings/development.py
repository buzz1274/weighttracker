from .production import *  # noqa: F403, F401

DEBUG = True
ALLOWED_HOSTS = [
    "weighttracker-backend",
    "127.0.0.1",
    "dev.weighttracker.zz50.co.uk",
]
CSRF_TRUSTED_ORIGINS = [
    "http://dev.weighttracker.zz50.co.uk",
]
