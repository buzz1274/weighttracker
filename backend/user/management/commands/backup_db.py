import os
import subprocess
from datetime import datetime

import boto3
from botocore.exceptions import ClientError
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Backup Database to S3"

    def __init__(self):
        super().__init__()

        try:
            self.s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        except ClientError:
            raise CommandError("Failed to connect to S3")

    def handle(self, *args, **options):
        file_name = f"db_backup_{datetime.today().strftime('%Y-%m-%d')}.sql"
        full_backup_path = f"/tmp/{file_name}"

        try:
            s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        except ClientError:
            raise CommandError("Failed to connect to S3")

        backup_command = (
            f"PGPASSWORD={settings.DATABASES['default']['PASSWORD']} "
            f"pg_dump --clean --inserts "
            f"-U{settings.DATABASES['default']['USER']} "
            f"-h{settings.DATABASES['default']['HOST']} > {full_backup_path}"
        )

        if (
            subprocess.call(backup_command, shell=True)
            or not os.path.isfile(full_backup_path)
            or not (file_stats := os.stat(full_backup_path))
            or not file_stats.st_size
        ):
            raise CommandError("Failed to generate DB dump")

        try:
            s3_client.upload_file(
                full_backup_path,
                settings.AWS_BUCKET_NAME,
                f"backups/weighttracker/{file_name}",
            )
        except ClientError:
            raise CommandError("Failed to upload DB dump to S3")
        finally:
            os.remove(full_backup_path)
