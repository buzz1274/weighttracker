#!/usr/bin/env bash

docker exec -it weighttracker-backend bash -c "python manage.py $@;"
