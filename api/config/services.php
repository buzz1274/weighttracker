<?php

    use Phalcon\Mvc\View\Simple as View;
    use Phalcon\Mvc\Url as UrlResolver;
    use Phalcon\DI\FactoryDefault;
    use Phalcon\Db\Adapter\Pdo\Mysql as DbAdapter;
    use Phalcon\Session\Adapter\Files as Session;

    $di = new FactoryDefault();

    /**
     * Sets the view component
     */
    $di['view'] = function () use ($config) {
        $view = new View();
        $view->setViewsDir($config->application->viewsDir);
        return $view;
    };

    /**
     * The URL component is used to generate all kind of urls in the application
     */
    $di['url'] = function () use ($config) {
        $url = new UrlResolver();
        $url->setBaseUri($config->application->baseUri);
        return $url;
    };

    $di['db'] = function () use ($config) {
        return new DbAdapter($config->toArray());
    };

    $di['session'] = function() {
        $session = new Session(array('uniqueId' => 'wt'));
        $session->start();

        error_log("SESSION START");

        return $session;
    };
