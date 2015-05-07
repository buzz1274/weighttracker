<?php

    if(!file_exists(__DIR__."/../config/config.ini") ||
      !is_array($settings = parse_ini_file(__DIR__."/../config/config.ini"))) {
      throw new \Exception('no settings file');
    }

    return new \Phalcon\Config(array(

        'MAINSITE_URL' => $settings['mainsite_url'],

        'database' => array(
            'adapter'    => 'Mysql',
            'host'       => 'localhost',
            'username'   => 'root',
            'password'   => '',
            'dbname'     => 'test',
            'charset'    => 'utf8',
        ),

        'application' => array(
            'modelsDir'      => APP_PATH . '/models/',
            'migrationsDir'  => APP_PATH . '/migrations/',
            'viewsDir'       => APP_PATH . '/views/',
            'baseUri'        => '/1/',
        )
    ));
