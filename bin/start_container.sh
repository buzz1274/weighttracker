if [ "$CONTAINER_TYPE" == "BACKEND" ] ; then
    sleep 30
    if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
        python manage.py runserver 0.0.0.0:8000
    else
        gunicorn weighttracker.wsgi:application --bind=0.0.0.0:8000 --reload --log-level debug
    fi
else
    if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
        cd frontend && npm install && npm run dev
    else
        cd frontend && npm install && npm run build
        sleep infinity
    fi
fi
