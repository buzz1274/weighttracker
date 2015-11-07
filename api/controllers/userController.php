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
            if(!$this->app->session->get('userID') ||
               !($user = userModel::findFirst($this->app->session->get('userID')))) {
                return $this->generateResponse(401);
            }

            $this->request->user->current_email = $user->email;

            if(!$this->user->isValidUser($this->request, 'edit')) {
                return $this->generateResponse(422, 'invalid user',
                                               array('errors' => $this->user->validationErrors));
            }

            $user->email = $this->request->user->email;
            $user->name = $this->request->user->name;
            $user->date_of_birth = date('Y-m-d', strtotime($this->request->user->date_of_birth));
            $user->sex = (strtolower($this->request->user->sex) === 'male' ? 'm' : 'f');
            $user->height = $this->request->user->height;
            $user->target_weight = $this->request->user->target_weight;

            if(!$user->save()) {
                return $this->generateResponse(500);
            }

            return $this->generateResponse();

        }
        //end edit

        /**
         * authenticates the user using the supplied credentials
         * @return mixed
         * @throws Exception
         */
        public function login() {

            if(isset($this->request->hash)) {
                $user = $this->user->findFirst(
                    array('conditions' => "reset_password_hash = ?1",
                          'bind' => array(1 => $this->request->hash)));

                if(!$user) {
                    return $this->generateResponse(422, 'invalid hash',
                                                   array('errors' => 'Unrecognized reset password link.'));
                }

                if(date_create($user->reset_password_hash_expiry) < date_create()) {
                    return $this->generateResponse(422, 'invalid hash',
                            array('errors' => 'Reset password link expired. Please request a new one'));
                }

                if(!$user->setPasswordHash(true)) {
                    $this->generateResponse(500);
                }

            } else {
                if(!isset($this->request->username) || !$this->request->username ||
                   !isset($this->request->password) || !$this->request->password ||
                   !($user = $this->user->login($this->request->username,
                                                $this->request->password))) {

                    $this->response['errors'] =
                        'Please enter a valid username and password';

                    return $this->generateResponse(422,
                                                   'user failed authentication');

                }
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

        /**
         * sends reset password email if supplied email
         * exists in the database
         * @return mixed
         */
        public function resetPassword() {

            if(!$this->app->request->getPost('email')) {
                return $this->generateResponse(422, 'invalid email',
                                               array('errors' => 'Please enter an email.'));
            }

            if(!($user = $this->user->findFirst(
                     array('conditions' => "email = ?1",
                           'bind' => array(1 => $this->app->request->getPost('email')))))) {
                return $this->generateResponse(422, 'unknown email',
                                               array('errors' => 'Email address not found.'));
            }

            $user->setPasswordHash();

            $email = new mail();
            $link = 'http://'.MAINSITE_URL.'/reset-password/?hash='.$user->reset_password_hash;

            if($email->send($this->app->request->getPost('email'),
                            'Password reset on weighttracker.zz50.co.uk',
                            'reset_email', array('link' => $link))) {
                return $this->generateResponse();
            } else {
                return $this->generateResponse(500);
            }
        }
        //end reset_password

        /**
         * change the users password
         * @return mixed
         * @throws Exception
         */
        public function changePassword() {
            if(!$this->app->session->get('userID') ||
               !($user = $this->user->findFirst($this->app->session->get('userID')))) {
                return $this->generateResponse(401);
            }

            if(!$this->app->request->getPost('password') ||
               !$this->app->request->getPost('passwordRepeat')) {
                return $this->generateResponse(422, 'missing password',
                                               array('errors' => 'Please enter password in both fields'));
            }

            if($this->app->request->getPost('password') !==
               $this->app->request->getPost('passwordRepeat')) {
                return $this->generateResponse(422, 'missing password',
                                               array('errors' => 'Passwords do not match'));
            }

            if(!$user->changePassword($this->app->request->getPost('password'))) {
                return $this->generateResponse(500);
            } else {
                return $this->generateResponse();
            }

        }
        //end changePassword


    }
