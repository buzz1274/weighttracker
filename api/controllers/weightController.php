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

                foreach($weights as $weight) {
                    $data[] = ['id' => $weight['weight_id'],
                               'weight_id' => $weight['weight_id'],
                               'date' => $weight['weighed_date'],
                               'weight' => $weight['weight'],
                               'change' => $weight['change']];
                }

                $this->response = array('weights' => $data);

            }

            return $this->generateResponse();

        }
        //end weights

        /**
         * return weight loss stats for current user
         * @return mixed
         */
        public function stats() {

            $user = new userModel();

            if(!$this->app->session->get('userID') ||
               !($user = $user->findFirst($this->app->session->get('userID')))) {
                $this->statusCode = '401';

                return $this->generateResponse();

            }

            if(!($stats = $this->weight->stats($user))) {
                $this->statusCode = '404';

                return $this->generateResponse();

            }

            $data[] = ['id' => $user->user_id,
                       'accountCreated' => $user->account_created,
                       'weightToTarget' => ($stats['currentWeight']['weight'] -
                                            $user->target_weight),
                       'targetWeight' => $user->target_weight,
                       'startWeight' => $stats['startWeight'],
                       'maxWeight' => $stats['maxWeight'],
                       'minWeight' => $stats['minWeight'],
                       'maxUnderweightWeight' => $stats['maxUnderweightWeight'],
                       'maxNormalWeight' => $stats['maxNormalWeight'],
                       'maxOverweightWeight' => $stats['maxOverweightWeight'],
                       'currentWeight' => $stats['currentWeight'],
                       'changeLastWeek' => $stats['changeLastWeek'],
                       'changeLastMonth' => $stats['changeLastMonth'],
                       'changeLastYear' => $stats['changeLastYear'],
                       'changeAllTime' => $stats['changeAllTime'],
                       'dateToTarget' => $stats['dateToTarget']];

            $this->response = array('stats' => $data);

            return $this->generateResponse();

        }
        //end stats

        /**
         * add a new weight
         * @return mixed
         */
        public function addWeight() {

            if(!$this->app->session->get('userID')) {
                $this->statusCode = '401';

                return $this->generateResponse();

            }

            $this->weight->weight = $this->request->weight->weight;
            $this->weight->weighed_date = $this->request->weight->date;
            $this->weight->user_id = $this->app->session->get('userID');

            if(!$this->weight->validateWeight('add')) {

                $this->statusCode = 422;
                $this->statusMessage = 'invalid weight';

                $this->response = array('errors' => $this->weight->errors);

                return $this->generateResponse();

            }

            if(!$this->weight->save() || !isset($this->weight->weight_id) ||
               !$this->weight->weight_id) {

                $this->statusCode = '500';

                return $this->generateResponse();

            }

            $date = strtotime($this->request->weight->date);
            $changeLastWeek =
                $this->weight->closestWeightToDate($this->weight->user_id,
                                           date('Y-m-d', mktime(0, 0, 0,
                                                                date('n',
                                                                     $date),
                                                                date('j',
                                                                     $date) - 7,
                                                                date('Y',
                                                                     $date))));

            $this->response =
                array('weight' =>
                    array('id' => $this->weight->weight_id,
                          'weight_id' => $this->weight->weight_id,
                          'date' => $this->weight->weighed_date,
                          'weight' => $this->weight->weight,
                          'changed' => round($this->weight->weight -
                                             $changeLastWeek, 2)));

            return $this->generateResponse();


        }
        //end addWeight

        /**
         * edit a weight
         * @return mixed
         */
        public function editWeight() {

            if(!$this->app->session->get('userID')) {
                $this->statusCode = '401';

                return $this->generateResponse();

            }

            $weight =
                weightModel::findFirst(
                    array('conditions' => "weight_id = ?1 AND user_id = ?2",
                          'bind' => array(1 => $this->request->weight->weight_id,
                                          2 => $this->app->session->get('userID'))));

            if(!$weight) {
                $this->statusCode = '404';

                return $this->generateResponse();

            }

            $weight->weighed_date = $this->request->weight->date;
            $weight->weight = $this->request->weight->weight;

            if(!$weight->validateWeight('edit')) {
                $this->statusCode = 422;
                $this->statusMessage = 'invalid weight';

                $this->response = array('errors' => $weight->errors);

                return $this->generateResponse();

            }

            if(!$weight->save()) {
                $this->statusCode = 500;

                return $this->generateResponse();

            }

            $date = strtotime($this->request->weight->date);
            $changeLastWeek =
                $weight->closestWeightToDate($weight->user_id,
                                             date('Y-m-d', mktime(0, 0, 0,
                                                                  date('n', $date),
                                                                  date('j', $date) - 7,
                                                                  date('Y', $date))));

            $this->response =
                array('weight' =>
                    array('id' => $weight->weight_id,
                          'weight_id' => $weight->weight_id,
                          'date' => $weight->weighed_date,
                          'weight' => $weight->weight,
                          'changed' => round($weight->weight -
                                             $changeLastWeek, 2)));

            return $this->generateResponse();


        }
        //end editWeight

    }
