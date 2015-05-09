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

      }

      return $app->response;

  });

    $app->notFound(function() use ($app, $config) {
        header('location: '.$config['MAINSITE_URL'].'/not-found');
        die();
    });
