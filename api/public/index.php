<?php

  use Phalcon\Loader;
  use Phalcon\Mvc\Micro;
  use Phalcon\DI\FactoryDefault;
  use Phalcon\Db\Adapter\Pdo\Postgresql as PdoPostgres;

  error_reporting(E_ALL);
  ini_set("display_errors", 1);

  try {

      define('APP_PATH', realpath('..'));

      if(!file_exists(__DIR__."/../config/config.ini") ||
         !is_array($settings = parse_ini_file(__DIR__."/../config/config.ini"))) {
          throw new \Exception('no settings file');
      }

      $config = include __DIR__."/../config/config.php";

      include APP_PATH.'/config/services.php';
      include APP_PATH.'/config/loader.php';

      $loader = new Loader();

      $loader->registerDirs(array(__DIR__ . '/models/'));

      $di->set('db', function() use($settings) {
          return new PdoPostgres(array("host" => $settings['host'],
                                       "username" => $settings['username'],
                                       "password" => $settings['password'],
                                       "dbname" => $settings['dbname']));
      });

      $app = new Micro($di);

      include APP_PATH.'/app.php';

      $app->handle();

  } catch (\Exception $e) {
      echo $e->getMessage();
  }
