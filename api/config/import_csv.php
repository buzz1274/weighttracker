<?php

    date_default_timezone_set('UTC');

    if(!file_exists(__DIR__."/../config/config.ini") ||
       !is_array($config = parse_ini_file(__DIR__."/../config/config.ini"))) {
        die("no settings file\n");
    }

    if(count($argv) != 3) {
        die("usage: php import_csv.php ".
            "<path to weights csv file> ".
            "<account email address>\n");
    }

    if(!file_exists(__DIR__."/".$argv[1])) {
        die("no such file ".$argv[1]."\n");
    }

    try {
        $db = new PDO("pgsql:dbname=" . $config['dbname'] .
                      ";host=" . $config['db_host'], $config['username'],
                      $config['password']);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    } catch(PDOException $e) {
        die("db connection failed: ".$e->getMessage());
    }

    try {
        $user = $db->prepare('SELECT user_id FROM "user" WHERE email = :email',
                             array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $user->execute(array(':email' => $argv[2]));
        $user = $user->fetch();

        if(!is_array($user) || !isset($user['user_id']) ||
           !(int)$user['user_id']) {
            die("unknown user ".$argv[2]);
        }

        $user = $user['user_id'];

    } catch(PDOException $e) {
        die("user query failed: ".$e->getMessage());
    }

    try {
        $query =
            $db->prepare('INSERT INTO "weight" (user_id, weight, weighed_date) '.
                         'VALUES (:user_id, :weight, :weighed_date)');

        if(($handle = fopen(__DIR__."/".$argv[1], "r")) !== false) {
            while(($weights = fgetcsv($handle, 1000, ",")) !== false) {
                if(isset($weights[0]) && isset($weights[1])) {
                    $query->execute(
                        array(':user_id' => $user,
                              ':weight' => $weights[1],
                              ':weighed_date' =>
                                  date('Y-m-d', strtotime(str_replace('/', '-',
                                                                      $weights[0])))));
                }
            }
        }
    } catch(PDOException $e) {
        die("weights query failed: ".$e->getMessage());
    }
