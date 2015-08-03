<?php

    use Phalcon\Http\Response;

    $app->response->setHeader('Access-Control-Allow-Origin',
                              'http://'.$config['MAINSITE_URL'].
                              $config['MAINSITE_URL_PORT']);
    $app->response->setHeader('Access-Control-Allow-Headers',
                              'Content-Type,X-Requested-With');
    $app->response->setHeader('Access-Control-Allow-Methods',
                              'HEAD,GET,PUT,POST,DELETE,OPTIONS');

    $app->get('/weights', function() use($app) {

        try {
            $weights = $app->modelsManager->executeQuery(
                "SELECT * FROM weight ORDER BY weighed_date DESC");
        } catch(Exception $e) {
            $app->response->setStatusCode(500, "Error");

            return $app->response;

        }

        if(!$weights) {
            $app->response->setStatusCode(404, "Not Found");

            return $app->response;

        }

        $total_weights = count($weights) - 1;
        $start_weight = $weights[$total_weights]->weight;

        for($i = 0; $i <= $total_weights; $i++) {
            $data[] =
                array('id' => $weights[$i]->weight_id,
                      'date' => $weights[$i]->weighed_date,
                      'weight' => $weights[$i]->weight,
                      'lost' => round($weights[$i]->weight - $start_weight, 2));
        }

        $app->response->setJsonContent(array('weights' => $data));

        return $app->response;

    });

    $app->put('/weights(/[0-9]{1,})?', function() use($app) {
        $app->response->setJsonContent(array('success' => true));

        return $app->response;
    });

    $app->post('/weights(/[0-9]{1,})?', function() use($app) {
        $weight = $app->request->getJsonRawBody();
        error_log(json_encode($weight));

        $app->response->setJsonContent(array('weight' =>
            array('id' => 2,
                  'date' => $weight->weight->date,
                  'weight' => $weight->weight->weight,
                  'lost' => 110 - $weight->weight->weight)));

        return $app->response;
    });

    $app->post('/users(/[0-9]{1,})?', function() use($app) {
        $user = new user();
        $response = $user->register($app->request->getJsonRawBody());

        if(isset($response['errors'])) {
            $app->response->setStatusCode(400, "User failed validation");
        } else {
            $app->response->setStatusCode(200, "OK");
        }

        $app->response->setJsonContent($response);

        return $app->response;
    });

    $app->options('/(weights|users)(/[0-9]{1,})?/?', function() use($app) {
        return $app->response;
    });

    $app->notFound(function() use ($app, $config) {
        header('location: http://'.$config['MAINSITE_URL'].'/not-found');
        die();
    });
