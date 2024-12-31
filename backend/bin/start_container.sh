sleep 30

python manage.py migrate --noinput
python manage.py collectstatic --noinput

cd /opt/weighttracker_backend_public/ && ln -s ../weighttracker.zz50.co.uk/public/media/ media

if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
  gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --reload --log-level debug
else
  gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --log-level warning
fi
