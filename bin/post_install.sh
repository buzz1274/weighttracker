docker exec -it weighttracker.zz50.co.uk bash -c \
"
python manage.py migrate --noinput
python manage.py collectstatic --noinput
"