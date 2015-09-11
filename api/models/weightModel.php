<?php

    use Phalcon\Mvc\Model;

    class weightModel extends Model {

        public function initialize() {
            $this->setSource('weight');
        }

    }
