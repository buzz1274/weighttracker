<?php

    if(!file_exists(__DIR__."/../config/config.ini") ||
       !is_array($config = parse_ini_file(__DIR__."/../config/config.ini"))) {
      throw new \Exception('no settings file');
    }

    if(!($db_host = getenv('POSTGRES_PORT_5432_TCP_ADDR'))) {
      $db_host = $config['db_host'];
    }

    return new \Phalcon\Config(array(

        'MAINSITE_URL' => $config['mainsite_url'],

        'database' => array(
            'adapter'    => 'Mysql',
            'host'       => $db_host,
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
