<?php

    class weightModel extends dbModel {

        public $errors = false;

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

            $query = "SELECT weight.weight_id, weights.weighed_date, ".
                     "       weights.date_difference, weight.weight, ".
                     "       last_week.last_week_date AS last_week_date, ".
                     "       last_week.weight AS last_week_weight, ".
                     "       weight.weight - last_week.weight AS change ".
                     "FROM (SELECT   w.weighed_date, ".
                     "               MIN(ABS((lw.weighed_date + 7) - w.weighed_date)) AS date_difference ".
                     '      FROM     weight w '.
                     '      JOIN     weight lw ON lw.user_id = w.user_id '.
                     "      WHERE    w.user_id = ? ".
                     "      GROUP BY w.weighed_date ".
                     "      ORDER BY w.weighed_date DESC, date_difference ASC) AS weights ".
                     "JOIN  weight ON (    weight.user_id = ? ".
                     "                 AND weight.weighed_date = weights.weighed_date) ".
                     "JOIN  (SELECT w.weighed_date, lw.weight, lw.weighed_date AS last_week_date, ".
                     "              ABS((lw.weighed_date + 7) - w.weighed_date) AS date_difference ".
                     "       FROM weight w ".
                     "       JOIN weight lw ON lw.user_id = w.user_id ".
                     "       WHERE w.user_id = ? ".
                     "       GROUP BY w.weighed_date, lw.weight, lw.weighed_date ".
                     "       ORDER BY w.weighed_date DESC, date_difference ASC ".
                     "       ) AS last_week ON (    last_week.date_difference = weights.date_difference ".
                     "                          AND weight.weighed_date = last_week.weighed_date) ".
                     "ORDER BY weights.weighed_date DESC";

            return $this->getReadConnection()->query(
                $query, array($userID, $userID, $userID))->fetchAll();

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
            $currentWeight = $this->closestWeightToDate($user->user_id,
                                                        date('Y-m-d'), true);

            $maxUnderweightWeight = round((($user->height / 100) *
                                           ($user->height / 100)) * 18.5, 2);

            $maxNormalWeight = round((($user->height / 100) *
                                      ($user->height / 100)) * 25, 2);

            $maxOverweightWeight = round((($user->height / 100) *
                                          ($user->height / 100)) * 30, 2);

            if($currentWeight['weight']) {
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
                    $changeLastWeek = round($currentWeight['weight'] -
                                            $changeLastWeek, 2);
                }

                if($changeLastMonth) {
                    $changeLastMonth = round($currentWeight['weight'] -
                                             $changeLastMonth, 2);
                }

                if($changeLastYear) {
                    $changeLastYear = round($currentWeight['weight'] -
                                            $changeLastYear, 2);
                }

                if($startWeight) {
                    $changeAllTime = round($currentWeight['weight'] -
                                           $startWeight, 2);
                }

            }

            $this->minMaxWeight($user->user_id);

            return ['currentWeight' => $currentWeight,
                    'changeLastWeek' => $changeLastWeek,
                    'changeLastMonth' => $changeLastMonth,
                    'changeLastYear' => $changeLastYear,
                    'changeAllTime' => $changeAllTime,
                    'startWeight' => $startWeight,
                    'maxUnderweightWeight' => $maxUnderweightWeight,
                    'maxNormalWeight' => $maxNormalWeight,
                    'maxOverweightWeight' => $maxOverweightWeight,
                    'minWeight' => $this->minMaxWeight($user->user_id, true),
                    'maxWeight' => $this->minMaxWeight($user->user_id, false),
                    'dateToTarget' => $this->dateToTarget($user->user_id,
                                                          $user->target_weight)];
        }
        //end stats

        /**
         * returns the closest weight to the supplied date
         * @param $userID
         * @param $date
         * @param $returnDate
         * @return mixed
         */
        public function closestWeightToDate($userID, $date,
                                            $returnDate = false) {
            $results = self::find(
                array('columns' => 'weight, weighed_date',
                      'conditions' => "user_id = ?1",
                      'bind' => array(1 => $userID, 2 => $date),
                      'order' => "ABS(weighed_date - DATE(?2))",
                      'limit' => 1))->toArray();

            if(is_array($results) && count($results) === 1) {
                if($returnDate) {
                    return $results[0];
                } else {
                    return $results[0]['weight'];
                }
            } else {
                return false;
            }
        }
        //end closestWeightToDate

        /**
         * validate the current weight
         * @param $action (add|edit)
         * @return boolean
         */
        public function validateWeight($action) {

            if((float)$this->weight <= 0 || (float)$this->weight != $this->weight) {
                $this->errors['weight'] = 'Please enter a valid weight';
            }

            if(!strtotime($this->weighed_date)) {
                $this->errors['date'] = 'Please enter a valid date';
            }

            if($action == 'add' &&
               self::find(array('conditions' => "weighed_date = ?1 AND user_id = ?2",
                                'bind' => array(1 => $this->weighed_date,
                                                2 => $this->user_id)))->count()) {
                $this->errors['date'] = 'Weight already added for this date';
            } else if($action == 'edit') {
                //validate that the dote does not already exist if
                //it has changed
            }

            return !is_array($this->errors);

        }
        //end validateWeight

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
