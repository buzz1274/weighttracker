import os
import subprocess

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
        try:
            if settings.DEBUG is not True:
                raise CommandError(
                    "DO NOT run backport_db on non development ENV."
                )

            files = {}

            for file in self.s3_client.list_objects(
                Bucket=settings.AWS_BUCKET_NAME
            )["Contents"]:
                if (
                    f"{settings.S3_BACKUP_PATH}" in file["Key"]
                    and ".sql" in file["Key"]
                ):
                    files[file["LastModified"].strftime("%s")] = file

            file = dict(sorted(files.items(), reverse=True))
            file = file[list(file)[0]]
            filename = f"/tmp/{file['Key'].rsplit('/')[-1]}"

            self.s3_client.download_file(
                settings.AWS_BUCKET_NAME, file["Key"], filename
            )

            if (
                not os.path.isfile(filename)
                or not (file_stats := os.stat(filename))
                or not file_stats.st_size
            ):
                raise FileNotFoundError

            import_command = (
                f"PGPASSWORD={settings.DATABASES['default']['PASSWORD']} "
                f"psql "
                f"-U{settings.DATABASES['default']['USER']} "
                f"-h{settings.DATABASES['default']['HOST']} < {filename}"
            )

            subprocess.call(import_command, shell=True)
            os.remove(filename)
        except (KeyError, IndexError, FileNotFoundError):
            raise CommandError("Failed to retrieve old backups")
        except (TypeError, ClientError):
            raise CommandError("Failed deleting old backup")
