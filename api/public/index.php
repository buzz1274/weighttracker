<?php

    $config = include __DIR__."/../config/config.php";

    use Phalcon\Loader;
    use Phalcon\Mvc\Micro;
    use Phalcon\DI\FactoryDefault;
    use Phalcon\Db\Adapter\Pdo\Postgresql as PdoPostgres;

    try {

        include APP_PATH.'/config/services.php';
        include APP_PATH.'/config/loader.php';

        $loader = new Loader();

        $loader->registerDirs(array(__DIR__ . '/models/'));

        $di->set('db', function() use($config) {
            return new PdoPostgres(
                array("host" => $config['database']['host'],
                      "username" => $config['database']['username'],
                      "password" => $config['database']['password'],
                      "dbname" => $config['database']['dbname']));
        });

        $app = new Micro($di);

        include APP_PATH.'/app.php';

        $app->handle();

    } catch (\Exception $e) {
        errorHandler($e->getMessage());
    }
