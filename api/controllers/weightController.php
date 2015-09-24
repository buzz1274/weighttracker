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
                           'weightToTarget' => ($stats['currentWeight']['weight'] -
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

            if(!$this->app->session->get('userID')) {
                $this->statusCode = '401';
            } else {

                $this->weight->weight = $this->request->weight->weight;
                $this->weight->weighed_date = $this->request->weight->date;
                $this->weight->user_id = $this->app->session->get('userID');

                //validate weight

                if(!$this->weight->save() || !isset($this->weight->weight_id) ||
                    !$this->weight->weight_id) {

                    $this->statusCode = '500';

                } else {

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
                        array('weight' => array('id' => $this->weight->weight_id,
                            'date' => $this->weight->weighed_date,
                            'weight' => $this->weight->weight,
                            'changed' => round($this->weight->weight -
                                               $changeLastWeek, 2)));

                    return $this->generateResponse();

                }

            }

        }
        //end addWeight

    }
