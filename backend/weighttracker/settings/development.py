from .production import *  # noqa: F403, F401

try:
    import pydevd_pycharm

    pydevd_pycharm.settrace(
        "host.docker.internal",
        port=10002,
        stdoutToServer=True,
        stderrToServer=True,
    )
except Exception:
    print("unable to run debugger")
    pass

DEBUG = True
CSRF_TRUSTED_ORIGINS = [
    "https://dev.weighttracker.zz50.co.uk",
    "http://dev.weighttracker.zz50.co.uk:5123",
]

CORS_ORIGIN_WHITELIST = [
    "http://dev.weighttracker.zz50.co.uk:5123",
]
ALLOWED_HOSTS += [  # noqa: F405
    "dev.weighttracker.zz50.co.uk",
]
