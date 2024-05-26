sleep 30

if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
  python manage.py runserver 0.0.0.0:8000
else
  gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --reload --log-level debug
fi
