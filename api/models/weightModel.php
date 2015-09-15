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
         * get weight loss stats for suppleid userID
         * @param $user
         * @return array
         */
        public function stats($user) {
            return ['dateToTarget' => $this->dateToTarget($user->user_id,
                                                          $user->target_weight)];
        }
        //end stats

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
                array('conditions' => "user_id = ?1 AND weighed_date BETWEEN ?2 AND ?3",
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
