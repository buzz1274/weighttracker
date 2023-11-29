BACKUPS_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"/../../../backups/weighttracker/
BACKUP_FILENAME=weighttracker_"$(date '+%Y-%m-%d')".sql
S3_BUCKET=s3://blta/backups/weighttracker/

docker exec -it weighttracker-backend bash -c 'PGPASSWORD=$DB_PASSWORD pg_dump --clean --inserts -U$DB_USERNAME -h$DB_HOST' > "$BACKUPS_DIR$BACKUP_FILENAME"

if [ -f "$BACKUPS_DIR$BACKUP_FILENAME" ]; then
    aws s3 cp  "$BACKUPS_DIR$BACKUP_FILENAME" "$S3_BUCKET""$BACKUP_FILENAME"
fi

#find "$BACKUPS_DIR" -mtime +7 -name '*.sql'
