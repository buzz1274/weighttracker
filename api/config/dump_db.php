<?php

    date_default_timezone_set('UTC');

    if(!file_exists(__DIR__."/../config/config.ini") ||
        !is_array($config = parse_ini_file(__DIR__."/../config/config.ini"))) {
        die("no settings file\n");
    }

    $command = 'export PGPASSWORD='.$config['password'].';'.
               'pg_dump -U'.$config['username'].' -h'.$config['db_host'].' '.
               '--column-inserts > '.
               $config['db_backup_folder'].'/weighttracker_db_dump_'.date('Y-m-d').'.sql';

    exec($command);

