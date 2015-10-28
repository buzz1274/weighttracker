<?php

    class userController extends controller {

        private $user = false;

        public function __construct($app) {
            parent::__construct($app);

            $this->user = new userModel();
        }
        //end __construct

        /**
         * returns user details for the currently logged in user
         * @return mixed
         */
        public function user() {
            if(!$this->app->session->get('userID') ||
               !($user = $this->user->findFirst($this->app->session->get('userID')))) {
                return $this->generateResponse(401);
            }

            $data[] = array('id' => $user->user_id,
                            'email' => $user->email,
                            'name' => $user->name,
                            'date_of_birth' => $user->date_of_birth,
                            'height' => $user->height,
                            'sex' => $user->sex == 'm' ? 'Male' : 'Female',
                            'target_weight' => $user->target_weight);

            $this->response = array('user' => $data);

            return $this->generateResponse();

        }
        //end user

        /**
         * edits the user profile for the currently logged in user
         * @return mixed
         */
        public function edit() {

        }
        //end edit

        /**
         * authenticates the user using the supplied credentials
         * @return mixed
         */
        public function login() {

            if(!isset($this->request->username) || !$this->request->username ||
               !isset($this->request->password) || !$this->request->password ||
               !($user = $this->user->login($this->request->username,
                                            $this->request->password))) {

                $this->response['errors'] =
                    'Please enter a valid username and password';

                return $this->generateResponse(422, 'user failed authentication');

            }

            $this->app->session->set('userID', $user->user_id);
            $this->response = array('token' => session_id(),
                                    'userID' => $user->user_id,
                                    'name' => $user->name);

            return $this->generateResponse();
        }
        //end login

        /**
         * destroys the session for current user
         */
        public function logout() {

            if($this->app->session->has("userId")) {
                $this->app->session->destroy();
            } else {
                $this->statusCode = 422;
                $this->statusMessage = 'user not authenticated';
            }

            return $this->generateResponse();
        }
        //end logout

        /**
         * register a new user using the supplied details
         * @return mixed
         */
        public function register() {

            $this->response = $this->user->register($this->request);

            if(isset($this->response['errors'])) {
                $this->statusCode = 422;
                $this->statusMessage = 'user failed validation';
            } elseif(!isset($this->response['user']) ||
                     !isset($this->response['user']['id'])) {
                $this->statusCode = 500;
                $this->statusMessage = 'failed';
            }

            return $this->generateResponse();

        }
        //end register


    }
