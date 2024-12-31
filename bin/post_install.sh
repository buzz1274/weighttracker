#!/usr/bin/env bash

sleep 10

ENVIRONMENT=$1
PROJECT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"/..
CRON_JOB="@daily $PROJECT_DIR/bin/housekeeping.sh"

docker exec postgres bash -c "psql -v ON_ERROR_STOP=1 --username 'postgres' <<-EOSQL
    CREATE DATABASE weight_tracker;
    CREATE USER weight_tracker;
    ALTER DATABASE weight_tracker OWNER TO weight_tracker;
    GRANT ALL PRIVILEGES ON DATABASE weight_tracker to weight_tracker;
    ALTER USER weight_tracker WITH PASSWORD 'weight_tracker';
EOSQL"

docker exec weighttracker-backend bash -c \
"
python manage.py migrate --noinput
python manage.py collectstatic --noinput
"

if [ "$ENVIRONMENT" == "PRODUCTION" ] ; then
    echo "FIXING FILE PERMISSIONS"
    sleep 10
    cd "$PROJECT_DIR"/.. && sudo chown -R ec2-user:ec2-user weighttracker

    ( crontab -l | grep -v -F "$CRON_JOB" ; echo "$CRON_JOB" ) | crontab -
fi

if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
    pre-commit install
fi
