import os
import subprocess
from datetime import datetime

import boto3
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Backup Database to S3"

    def handle(self, *args, **options):
        file_name = (
            f"/tmp/db_backup_{datetime.today().strftime('%Y-%m-%d')}.sql"
        )
        s3_client = boto3.client(
            "s3",
            settings.AWS_ACCESS_KEY_ID,
            settings.AWS_SECRET_KEY,
        )
        backup_command = (
            f"PGPASSWORD={settings.DATABASES['default']['PASSWORD']} "
            f"pg_dump --clean --inserts "
            f"-U{settings.DATABASES['default']['USER']} "
            f"-h{settings.DATABASES['default']['HOST']} > {file_name}"
        )

        if (
            subprocess.call(backup_command, shell=True)
            or not os.path.isfile(file_name)
            or not (file_stats := os.stat(file_name))
            or not file_stats.st_size
        ):
            raise BackupDatabaseException("Failed to generate DB dump")
