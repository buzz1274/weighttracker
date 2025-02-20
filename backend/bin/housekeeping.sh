python manage.py backup_db



#BACKUPS_DIR="/tmp/"
#BACKUP_FILENAME=weighttracker_"$(date '+%Y-%m-%d')".sql

#export PGPASSWORD=$DB_PASSWORD; pg_dump --clean --inserts -U"$DB_USERNAME" -h"$DB_HOST" > "$BACKUPS_DIR$BACKUP_FILENAME"

#if [ -f "$BACKUPS_DIR$BACKUP_FILENAME" ]; then
#  python - << EOF
#    print('test')
#EOF


#
#    aws s3 cp  "$BACKUPS_DIR$BACKUP_FILENAME" "$WEIGHT_TRACKER_S3_BUCKET""$BACKUP_FILENAME"
#    rm "$BACKUPS_DIR$BACKUP_FILENAME"
#fi
