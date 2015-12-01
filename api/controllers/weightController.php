<?php

    class weightController extends controller {

        public function __construct($app) {
            parent::__construct($app);

            $this->weight = new weightModel();
            $this->user = new userModel();

        }
        //end __construct

        /**
         * gets all weights for the current user
         * @return mixed
         */
        public function weights() {

            if(!$this->app->session->get('userID')) {
                return $this->generateResponse(401);
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
                return $this->generateResponse(401);
            }

            if(!($stats = $this->weight->stats($user))) {
                return $this->generateResponse(200, false, array('stats' => false));
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
                       'changeGreatest' => $stats['changeGreatest'],
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
                return $this->generateResponse(401);
            }

            $this->weight->weight = $this->request->weight->weight;
            $this->weight->weighed_date = $this->request->weight->date;
            $this->weight->user_id = $this->app->session->get('userID');

            if(!$this->weight->validateWeight('add')) {
                return $this->generateResponse(422, 'invalid weight',
                                               array('errors' => $this->weight->errors));
            }

            if(!$this->weight->save() || !isset($this->weight->weight_id) ||
               !$this->weight->weight_id) {
                return $this->generateResponse(500);
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
        public function editWeight($weightID) {

            if(!$this->app->session->get('userID')) {
                return $this->generateResponse(401);
            }

            $weight = $this->weight->weight($this->app->session->get('userID'),
                                            $weightID);

            if(!($weight)) {
                return $this->generateResponse(404);
            }

            $weight->weighed_date = $this->request->weight->date;
            $weight->weight = $this->request->weight->weight;

            if(!$weight->validateWeight('edit')) {
                return $this->generateResponse(422, 'invalid weight',
                                               array('errors' => $weight->errors));
            }

            if(!$weight->save()) {
                return $this->generateResponse(500);
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

        /**
         * deletes a weight
         * @param $weightID
         * @return mixed
         */
        public function deleteWeight($weightID) {
            if(!$this->app->session->get('userID')) {
                return $this->generateResponse(401);
            }

            $weight = $this->weight->weight($this->app->session->get('userID'),
                                            $weightID);

            if(!($weight)) {
                return $this->generateResponse(404);
            }

            if($weight->delete()) {
                return $this->generateResponse(204);
            } else {
                return $this->generateResponse(500);
            }

        }
        //end deleteWeight

    }
