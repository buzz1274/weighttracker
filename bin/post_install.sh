#!/usr/bin/env bash

sleep 10

ENVIRONMENT=$1

docker exec postgres bash -c 'psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE DATABASE "$WEIGHT_TRACKER_DB_NAME";
    CREATE USER "$WEIGHT_TRACKER_DB_USERNAME";
    ALTER DATABASE "$WEIGHT_TRACKER_DB_NAME" OWNER TO "$WEIGHT_TRACKER_DB_USERNAME";
    GRANT ALL PRIVILEGES ON DATABASE "$WEIGHT_TRACKER_DB_NAME" to "$WEIGHT_TRACKER_DB_USERNAME";
    ALTER USER "$WEIGHT_TRACKER_DB_USERNAME" WITH PASSWORD "$WEIGHT_TRACKER_DB_PASSWORD";
EOSQL'

docker exec weighttracker-backend bash -c \
"
python manage.py migrate --noinput
python manage.py collectstatic --noinput
"

if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
    pre-commit install
fi
