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

            if(!$this->app->session->get('userID')) {
                $this->statusCode = '401';

                return $this->generateResponse();
            }

            if((!$weights = $this->weight->weights($this->app->session->get('userID')))) {
                $this->response = array('weights' => false);
            } else {

                $start_weight = $weights->getFirst()->weight;

                foreach($weights as $weight) {
                    $data[] = ['id' => $weight->weight_id,
                               'date' => $weight->weighed_date,
                               'weight' => $weight->weight,
                               'lost' => $start_weight - $weight->weight];
                }

                $this->response = array('weights' => $data);
            }

            return $this->generateResponse();

        }


    }
