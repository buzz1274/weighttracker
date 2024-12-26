sleep 30

if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
  sleep infinity
  #gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --reload --log-level debug
else
  sleep infinity
  #gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --log-level warning
fi
