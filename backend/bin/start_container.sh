python manage.py migrate --noinput
python manage.py collectstatic --noinput

if [ "$ENVIRONMENT" == "development" ] ; then
  gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --reload --log-level debug
else
  gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --log-level warning
fi
