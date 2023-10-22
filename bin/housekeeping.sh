BACKUPS_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"/../../../backups/weighttracker/
BACKUP_FILENAME="$BACKUP_DIR"weighttracker_"$(date '+%Y-%m-%d')".sql

docker exec -it weighttracker-backend bash -c 'PGPASSWORD=$DB_PASSWORD pg_dump -U$DB_USERNAME -h$DB_HOST' > "$BACKUP_FILENAME"
