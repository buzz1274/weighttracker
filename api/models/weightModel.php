<?php

    class weightModel extends dbModel {

        //db columns
        public $weight_id;
        public $user_id;
        public $weight;
        public $weighed_date;

        public function initialize() {
            $this->setSource('weight');
        }

        /**
         * get all weights for the supplied userID
         * @param $userID
         * @return mixed
         */
        public function weights($userID) {
            $weights = self::find(array('conditions' => "user_id = ?1",
                                        'bind' => array(1 => $userID),
                                        'order' => 'weighed_date DESC'));
            return $weights;
        }
        //end weights

        /**
         * get weight loss stats for supplied userID
         * @param $user
         * @return array
         */
        public function stats($user) {

            $changeLastWeek = false;
            $changeLastMonth = false;
            $changeLastYear = false;
            $startWeight = $this->startWeight($user->user_id);
            $currentWeight = $this->closestWeightToDate($user->user_id, date('Y-m-d'));

            if($currentWeight) {
                $changeLastWeek =
                    $this->closestWeightToDate($user->user_id,
                                               date('Y-m-d', mktime(0, 0, 0,
                                                                    date('n'),
                                                                    date('j') - 7,
                                                                    date('Y'))));

                $changeLastMonth =
                    $this->closestWeightToDate($user->user_id,
                                               date('Y-m-d', mktime(0, 0, 0,
                                                                    date('n') - 1,
                                                                    date('j'),
                                                                    date('Y'))));

                $changeLastYear =
                    $this->closestWeightToDate($user->user_id,
                                               date('Y-m-d', mktime(0, 0, 0,
                                                                    date('n'),
                                                                    date('j'),
                                                                    date('Y') - 1)));

                if($changeLastWeek) {
                    $changeLastWeek = round($currentWeight - $changeLastWeek, 2);
                }

                if($changeLastMonth) {
                    $changeLastMonth = round($currentWeight - $changeLastMonth, 2);
                }

                if($changeLastYear) {
                    $changeLastYear = round($currentWeight - $changeLastYear, 2);
                }

                if($startWeight) {
                    $changeAllTime = round($currentWeight - $startWeight, 2);
                }

            }

            $this->minMaxWeight($user->user_id);

            return ['currentWeight' => $currentWeight,
                    'changeLastWeek' => $changeLastWeek,
                    'changeLastMonth' => $changeLastMonth,
                    'changeLastYear' => $changeLastYear,
                    'changeAllTime' => $changeAllTime,
                    'startWeight' => $startWeight,
                    'minWeight' => $this->minMaxWeight($user->user_id, true),
                    'maxWeight' => $this->minMaxWeight($user->user_id, false),
                    'dateToTarget' => $this->dateToTarget($user->user_id,
                                                          $user->target_weight)];
        }
        //end stats

        /**
         * determine a users minimum & maximum weight
         * @param $userID
         * @param $min
         * @return mixed
         */
        private function minMaxWeight($userID, $min = true) {
            if($min) {
                $direction = 'weight ASC';
            } else {
                $direction = 'weight DESC';
            }

            $weight =
                self::findFirst(array('columns' => 'weighed_date, weight',
                                      'conditions' => "user_id = ?1",
                                      'bind' => array(1 => $userID),
                                      'order' => $direction))->toArray();

            if(is_array($weight) && isset($weight['weight'])) {
                return $weight;
            } else {
                return false;
            }

        }
        //end minMaxWeight

        /**
         * get first weight entered
         * @param $userID
         * @return mixed
         */
        private function startWeight($userID) {
            $weights =
                self::find(array('columns' => 'weight',
                                 'conditions' => "user_id = ?1",
                                 'bind' => array(1 => $userID),
                                 'order' => 'weighed_date',
                                 'limit' => 1))->toArray();

            if(is_array($weights) && count($weights) === 1) {
                return $weights[0]['weight'];
            } else {
                return false;
            }
        }
        //end startWeight

        /**
         * returns the closest weight to the supplied date
         * @param $userID
         * @param $date
         * @return mixed
         */
        private function closestWeightToDate($userID, $date) {
            $results = self::find(
                array('columns' => 'weight',
                      'conditions' => "user_id = ?1",
                      'bind' => array(1 => $userID, 2 => $date),
                      'order' => "ABS(weighed_date - DATE(?2))",
                      'limit' => 1))->toArray();

            if(is_array($results) && count($results) === 1) {
                return $results[0]['weight'];
            } else {
                return false;
            }
        }
        //end closestWeightToDate

        /**
         * calculates the date the target weight will be hit
         * based on weight change over the last 28 days
         * @param $userID
         * @param $targetWeight
         * @return bool|string
         */
        private function dateToTarget($userID, $targetWeight) {
            $endDate = date('Y-m-d', strtotime('now'));
            $startDate = date('Y-m-d', mktime(0, 0, 0, date('n'),
                                              date('j') - 28, date('Y')));

            $results = self::find(
                array('columns' => 'weight, weighed_date',
                      'conditions' => "user_id = ?1 AND weighed_date BETWEEN ?2 AND ?3",
                      'bind' => array(1 => $userID,
                                      2 => $startDate,
                                      3 => $endDate),
                      'order' => 'weighed_date ASC'))->toArray();

            if(!is_array($results) || count($results) === 1) {
                return false;
            } else {
                $currentWeight = $results[0]['weight'];

                if(count($results) < 28) {
                    $dayCount = date_diff(date_create($startDate),
                                          date_create($endDate))->format('%a');
                } else {
                    $dayCount = 28;
                }

                $averageWeightChange = ($results[count($results) - 1]['weight'] -
                                        $results[0]['weight']) / $dayCount;

                if($targetWeight === $currentWeight ||
                   ($targetWeight > $currentWeight && $averageWeightChange < 0) ||
                   ($targetWeight < $currentWeight && $averageWeightChange > 0)) {
                    return false;
                }

                $daysToTarget = abs(ceil((108.1 - 78)/$averageWeightChange));
                $dateToTarget = date('Y-m-d', mktime(0, 0, 0,
                                                     date('n'),
                                                     date('j') + $daysToTarget,
                                                     date('Y')));

                return $dateToTarget;

            }

        }
        //end dateToTarget

    }
