<?php

    date_default_timezone_set('UTC');

    if(!file_exists(__DIR__."/../config/config.ini") ||
       !is_array($config = parse_ini_file(__DIR__."/../config/config.ini"))) {
      throw new \Exception('no settings file');
    }

    return new \Phalcon\Config(array(

        'MAINSITE_URL' => $config['mainsite_url'],
        'MAINSITE_URL_PORT' => $config['port'] ? ':'.$config['port'] : '',

        'database' => array(
            'host'       => $config['db_host'],
            'username'   => $config['username'],
            'password'   => $config['password'],
            'dbname'     => $config['dbname'],
            'charset'    => 'utf8',
        ),

        'application' => array(
            'modelsDir'      => APP_PATH . '/models/',
            'migrationsDir'  => APP_PATH . '/migrations/',
            'viewsDir'       => APP_PATH . '/views/',
            'baseUri'        => '/1/',
        )

    ));
