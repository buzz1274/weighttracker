#!/usr/bin/env bash

ENVIRONMENT=$1

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
    echo "FIXING FILE PERMISSIONS"
    cd "$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"/../.. \
    && sudo chown -R ec2-user:ec2-user weighttracker.zz50.co.uk 
fi