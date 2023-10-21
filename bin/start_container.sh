#get env from env vars

if [ "$CONTAINER_TYPE" == "BACKEND" ] ; then
    python manage.py runserver 0.0.0.0:8000    
else
    cd frontend && npm run dev
fi

#gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --reload --log-level debug
