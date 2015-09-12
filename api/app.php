<?php

    use Phalcon\Http\Response;

    $app->response->setHeader('Access-Control-Allow-Origin',
                              'http://'.$config['MAINSITE_URL'].
                              $config['MAINSITE_URL_PORT']);
    $app->response->setHeader('Access-Control-Allow-Credentials', 'true');
    $app->response->setHeader('Access-Control-Allow-Headers',
                              'Accept,Content-Type,X-Requested-With');
    $app->response->setHeader('Access-Control-Allow-Methods',
                              'HEAD,GET,PUT,POST,DELETE,OPTIONS');

    /*
    $app->put('/weights(/[0-9]{1,})?', function() use($app) {
        $app->response->setJsonContent(array('success' => true));

        return $app->response;
    });

    $app->post('/weights(/[0-9]{1,})?', function() use($app) {
        $weight = $app->request->getJsonRawBody();

        $app->response->setJsonContent(array('weight' =>
            array('id' => 2,
                  'date' => $weight->weight->date,
                  'weight' => $weight->weight->weight,
                  'lost' => 110 - $weight->weight->weight)));

        return $app->response;
    });
    */

    $app->get('/weights', function() use($app) {
        $controller = new weightController($app);
        return $controller->weights();
    });

    $app->delete('/logout', function() use($app) {
        $controller = new userController($app);
        $controller->logout();
    });

    $app->post('/login', function() use($app) {
        $controller = new userController($app);
        return $controller->login();
    });

    $app->post('/users(/[0-9]{1,})?', function() use($app) {
        $controller = new userController($app);
        return $controller->register();
    });

    $app->options('/(weights|users|login|logout|error)(/[0-9]{1,})?/?',
        function() use($app) { return $app->response; }
    );

    $app->error(function($e) use($app) {
        errorHandler($e->getMessage());
    });

    $app->notFound(function() use ($app, $config) {
        errorHandler('not found', 404);
    });
