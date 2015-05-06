<?php

  use Phalcon\Http\Response;

  $app->get('/weights', function() use($app) {
      $weights = $app->modelsManager->executeQuery(
        "SELECT * FROM weight");

      $response = new Response();

      if(!$weights) {
          $response->setJsonContent(array('status' => 'NOT-FOUND'));
      } else {
          foreach($weights as $weight) {
              $data[] = array('id' => $weight->weight_id,
                              'date' => $weight->weighed_date,
                              'weight' => $weight->weight);
          }

          $response->setJsonContent($data);

      }

      return $response;

  });

  $app->notFound(function() use ($app) {
    $app->response->setStatusCode(404, "Not Found")->sendHeaders();
  });
