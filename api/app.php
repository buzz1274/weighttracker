<?php

  use Phalcon\Http\Response;

  $app->get('/weights', function() use($app) {
      $weights = $app->modelsManager->executeQuery(
        "SELECT * FROM weight ORDER BY weighed_date DESC");

      $app->response->setHeader('Access-Control-Allow-Origin', '*');
      $app->response->setHeader('Access-Control-Allow-Headers', 'X-Requested-With');

      if(!$weights) {
          $app->response->setJsonContent(array('status' => 'NOT-FOUND'));
      } else {
          foreach($weights as $weight) {
              $data[] = array('id' => $weight->weight_id,
                              'date' => $weight->weighed_date,
                              'weight' => $weight->weight);
          }

          $app->response->setJsonContent(array('weights' => $data));

      }

      return $app->response;

  });

    $app->notFound(function() use ($app, $config) {
        header('location: '.$config['MAINSITE_URL'].'/not-found');
        die();
    });
