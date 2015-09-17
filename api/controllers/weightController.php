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

                $start_weight = $weights->getLast()->weight;

                foreach($weights as $weight) {
                    $data[] = ['id' => $weight->weight_id,
                               'date' => $weight->weighed_date,
                               'weight' => $weight->weight,
                               'change' => $weight->weight - $start_weight];
                }

                $this->response = array('weights' => $data);

            }

            return $this->generateResponse();

        }
        //end weights

        /**
         * return weight loss stats for current user
         */
        public function stats() {

            $user = new userModel();

            if(!$this->app->session->get('userID') ||
               !($user = $user->findFirst($this->app->session->get('userID')))) {

                $this->statusCode = '401';

                return $this->generateResponse();

            }

            if(!($stats = $this->weight->stats($user))) {
                $this->response = array('stats' => false);
            } else {
                $data[] = ['id' => $user->user_id,
                           'accountCreated' => $user->account_created,
                           'weightToTarget' => ($stats['currentWeight'] -
                                                $user->target_weight),
                           'targetWeight' => $user->target_weight,
                           'startWeight' => $stats['startWeight'],
                           'maxWeight' => $stats['maxWeight'],
                           'minWeight' => $stats['minWeight'],
                           'currentWeight' => $stats['currentWeight'],
                           'changeLastWeek' => $stats['changeLastWeek'],
                           'changeLastMonth' => $stats['changeLastMonth'],
                           'changeLastYear' => $stats['changeLastYear'],
                           'changeAllTime' => $stats['changeAllTime'],
                           'dateToTarget' => $stats['dateToTarget']];

                $this->response = array('stats' => $data);

            }

            return $this->generateResponse();

        }
        //end stats

        /**
         * add a new weight
         * @return mixed
         */
        public function addWeight() {

            /*
            $app->response->setJsonContent(array('weight' =>
                array('id' => 2,
                    'date' => $weight->weight->date,
                    'weight' => $weight->weight->weight,
                    'lost' => 110 - $weight->weight->weight)));
            */

            return $this->generateResponse();

        }
        //end addWeight

    }
