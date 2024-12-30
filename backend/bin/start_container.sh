sleep 30

if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
  gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --reload --log-level debug
else
  gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --log-level warning
fi
