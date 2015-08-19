<?php

    class weightController {

        public function __construct($app) {
            parent::__construct($app);

            $this->weight = new weightModel();
        }
        //end __construct

    }
