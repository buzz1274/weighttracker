<?php

    class weightController extends controller {

        public function __construct($app) {
            parent::__construct($app);

            $this->weight = new weightModel();
        }
        //end __construct

        /**
         * gets all weights for the current user
         * @return mixed
         */
        public function weights() {

            if((!$weights = $this->weight->weights($this->app->session->get('userID')))) {
                $this->response = array('weights' => false);
            } else {
                $this->response = array('weights' => false);
            }

            /*
            $total_weights = count($weights) - 1;
            $start_weight = $weights[$total_weights]->weight;

            for($i = 0; $i <= $total_weights; $i++) {
                $data[] =
                    array('id' => $weights[$i]->weight_id,
                          'date' => $weights[$i]->weighed_date,
                          'weight' => $weights[$i]->weight,
                          'lost' => round($weights[$i]->weight - $start_weight, 2));
            }
            */

            return $this->generateResponse();

        }


    }
