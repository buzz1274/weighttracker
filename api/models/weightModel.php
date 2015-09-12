<?php

    use Phalcon\Mvc\Model;

    class weightModel extends Model {

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
                                        'order' => 'weighed_date ASC'));
            return $weights;
        }
        //end weights

    }
