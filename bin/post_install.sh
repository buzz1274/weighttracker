docker exec -it weighttracker.zz50.co.uk bash -c \
"
python manage.py migrate --noinput
python manage.py collectstatic --noinput
cd /opt/weighttracker.zz50.co.uk/frontend/ && npm run build
"

echo "Fixing File Permissions"
cd "$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"/../.. \
&& sudo chown -R ec2-user:ec2-user weighttracker.zz50.co.uk 