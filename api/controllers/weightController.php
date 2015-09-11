<?php

    class weightController extends controller {

        public function __construct($app) {
            parent::__construct($app);

            $this->weight = new weightModel();
        }
        //end __construct

        public function weights() {
            error_log("weights");
            //error_log(json_encode($_SESSION));
            error_log(json_encode($_COOKIE));
            error_log(json_encode($this->app->session->get('userId')));

            return $this->generateResponse();

        }


    }
