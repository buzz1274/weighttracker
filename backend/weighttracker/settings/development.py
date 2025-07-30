from contextlib import suppress

from .production import *  # noqa: F403, F401

with suppress(ConnectionRefusedError):
    try:
        import pydevd_pycharm

        pydevd_pycharm.settrace(
            "host.docker.internal",
            port=10002,
            stdoutToServer=True,
            stderrToServer=True,
        )
    except (ModuleNotFoundError, ConnectionRefusedError):
        print("pydebugger failed to connect")

DEBUG = True
CSRF_TRUSTED_ORIGINS = [
    "https://dev.weighttracker.zz50.co.uk",
    "http://dev.weighttracker.zz50.co.uk:5123",
]

CORS_ALLOWED_ORIGINS = [
    "http://dev.weighttracker.zz50.co.uk:5123",
    "https://dev.weighttracker.zz50.co.uk",
]

CORS_ORIGIN_WHITELIST = [
    "http://dev.weighttracker.zz50.co.uk:5123",
]
ALLOWED_HOSTS += [  # noqa: F405
    "https://dev.weighttracker.zz50.co.uk",
    "http://dev.weighttracker.zz50.co.uk",
]
