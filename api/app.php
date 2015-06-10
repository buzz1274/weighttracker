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
            if($i < $total_weights) {
                $weight_loss_this_week =
                  round($weights[$i]->weight - $weights[$i + 1]->weight, 2);
            } else {
                $weight_loss_this_week = 0;
            }

            $data[] = array('id' => $weights[$i]->weight_id,
                            'date' => $weights[$i]->weighed_date,
                            'weight' => $weights[$i]->weight,
                            'difference' => $weight_loss_this_week,
                            'gone' =>
                                round($weights[$i]->weight - $start_weight, 2));
        }

        $app->response->setJsonContent(array('weights' => $data));

        return $app->response;

    });

    $app->put('/weights/[0-9]{1,}', function() use($app) {
        $app->response->setJsonContent(array('success' => true));

        return $app->response;
    });

    $app->options('/weights/[0-9]{1,}', function() use($app) {
        return $app->response;
    });

    $app->notFound(function() use ($app, $config) {
        header('location: http://'.$config['MAINSITE_URL'].'/not-found');
        die();
    });
