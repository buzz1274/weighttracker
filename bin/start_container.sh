#get env from env vars

sleep 30
/etc/init.d/nginx start
python manage.py runserver 0.0.0.0:8000
#gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --reload --log-level debug

sleep infinity