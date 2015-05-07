<?php

  use Phalcon\Http\Response;

  $app->get('/weights', function() use($app) {
      $weights = $app->modelsManager->executeQuery(
        "SELECT * FROM weight");

      if(!$weights) {
          $app->response->setJsonContent(array('status' => 'NOT-FOUND'));
      } else {
          foreach($weights as $weight) {
              $data[] = array('id' => $weight->weight_id,
                              'date' => $weight->weighed_date,
                              'weight' => $weight->weight);
          }

          $app->response->setJsonContent($data);

      }

      return $app->response;

  });

    $app->notFound(function() use ($app, $config) {
        $app->response->setStatusCode(404, "Not Found")->sendHeaders();
        header('location: '.$config['MAINSITE_URL'].'/not-found');
        die();
    });
