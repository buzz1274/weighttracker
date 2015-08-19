<?php

    class userController extends controller {

        private $user = false;

        public function __construct($app) {
            parent::__construct($app);

            $this->user = new userModel();
        }
        //end __construct

        public function login() {
            $this->response =
                $this->user->login($this->app->request->getJsonRawBody());

            $this->app->session->set("user_id", 1);

            return $this->generateResponse();
        }
        //end login

        public function register() {
            /*
            $app->post('/users(/[0-9]{1,})?', function() use($app) {
                $user = new user();
                $response = $user->register($app->request->getJsonRawBody());

                if(isset($response['errors'])) {
                    $app->response->setStatusCode(422, "User failed validation");
                } elseif(isset($response['user']) && isset($response['user']['id'])) {
                    $app->response->setStatusCode(200, "OK");
                } else {
                    $app->response->setStatusCode(500, "Failed");
                }

                $app->response->setJsonContent($response);

                return $app->response;
            });
            */

        }
        //end register


    }
