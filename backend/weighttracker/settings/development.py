from .production import *  # noqa: F403, F401

DEBUG = True
CSRF_TRUSTED_ORIGINS = [
    "https://dev.weighttracker.zz50.co.uk",
    "http://dev.weighttracker.zz50.co.uk:5123",
]

CORS_ORIGIN_WHITELIST = [
    "http://dev.weighttracker.zz50.co.uk:5123",
]
ALLOWED_HOSTS += [
    "dev.weighttracker.zz50.co.uk",
]
