<?php

    register_shutdown_function('errorHandler');
    date_default_timezone_set('UTC');
    error_reporting(E_ALL);
    ini_set("display_errors", 0);
    session_save_path("/tmp/");

    define('APP_PATH', realpath('..'));

    if(!getenv('EB_HOSTED') &&
       (!file_exists(__DIR__."/../config/config.ini") ||
        !is_array($config = parse_ini_file(__DIR__."/../config/config.ini")))) {
        throw new \Exception('no settings file');
    } elseif(getenv('EB_HOSTED')) {
        foreach(array('db_host', 'dbname', 'mailgun_api_key',
                      'development_mode', 'email_address',
                      'mailgun_api_key', 'mailgun_domain', 'port',
                      'mainsite_url', 'password', 'username') as $key) {
            $config[$key] = getenv($key);
        }
    }

    if(!$config) {
        throw new \Exception('unable to create config');
    }

    require '../vendor/autoload.php';
    require 'mail.class.inc.php';

    define('MAILGUN_API_KEY', $config['mailgun_api_key']);
    define('MAILGUN_DOMAIN', $config['mailgun_domain']);
    define('EMAIL_ADDRESS', $config['email_address']);
    define('MAINSITE_URL', $config['mainsite_url']);

    /**
     * handle fatal errors
     * @param bool|false $message
     * @param int $statusCode
     */
    function errorHandler($message = false, $statusCode = 500) {

        if(!$message) {
            if(is_array($error = error_get_last()) && isset($error['type']) &&
               in_array($error['type'], array(E_PARSE, E_ERROR)) &&
               isset($error['message'])) {
                $message = $error['message'];
            }
        }

        if($message) {
            error_log($message);

            http_response_code($statusCode);
            echo json_encode(array('responseJSON' => array('status' => $statusCode)));
            die();
        }

    }
    //end errorHandler

    return new \Phalcon\Config(array(

        'MAINSITE_URL' => $config['mainsite_url'],
        'MAINSITE_URL_PORT' => $config['port'] ? ':'.$config['port'] : '',
        'MAILGUN_DOMAIN' => $config['mailgun_domain'],
        'MAILGUN_API_KEY' => $config['mailgun_api_key'],

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
            'controllerDir'  => APP_PATH . '/controllers/',
            'viewsDir'       => APP_PATH . '/views/',
            'baseUri'        => '/1/',
        )

    ));
