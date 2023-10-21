#!/usr/bin/env bash

ENVIRONMENT=$1
PROJECT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"/../

docker exec postgres12 bash -c "psql -v ON_ERROR_STOP=1 --username 'postgres' <<-EOSQL
    CREATE DATABASE weight_tracker;
    CREATE USER weight_tracker;
    GRANT ALL PRIVILEGES ON DATABASE weight_tracker to weight_tracker;
    ALTER USER weight_tracker WITH PASSWORD 'weight_tracker';
EOSQL"

docker exec weighttracker-backend bash -c \
"
python manage.py migrate --noinput
python manage.py collectstatic --noinput
"

if [ "$ENVIRONMENT" == "PRODUCTION" ] ; then
    sleep 10
    echo "FIXING FILE PERMISSIONS"
    cd "$PROJECT_DIR"/.. && sudo chown -R ec2-user:ec2-user weighttracker

    #add housekeeping job to cron with no duplication if housekeeping script exists
    #( crontab -l | grep -v -F "$croncmd" ; echo "$cronjob" ) | crontab -

    #add loop to check if node is in restarting state the stop and rm

fi

if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
    pre-commit install
fi
