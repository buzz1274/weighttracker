<?php

    use Phalcon\Mvc\Model;

    class user extends Model {

        //db columns
        public $user_id;
        public $email;
        public $password;
        public $name;
        public $date_of_birth;
        public $sex;
        public $height;
        public $weight;

        private $validationErrors = false;

        public function register($user) {

            if(!$this->isValidUser($user)) {
                return array('errors' => $this->validationErrors);
            }

            $this->email = $user->user->email;
            $this->password = $this->hashPassword($user->user->password);
            $this->name = $user->user->name;
            $this->date_of_birth = date('Y-m-d', strtotime($user->user->date_of_birth));
            $this->sex = (strtolower($user->user->sex) === 'male' ? 'm' : 'f');
            $this->height = $user->user->height;
            $this->weight = $user->user->weight;

            try {
                if(!$this->save()) {
                    return false;
                } else {
                    return array('user' => array('id' => $this->user_id));
                }
            } catch(Exception $e) {
                return false;
            }

        }
        //end register

        /**
         * hash password before insertion into database
         */
        private function hashPassword($password) {
            return $password;
        }
        //end hash password

        /**
         * validate user
         */
        private function isValidUser($user) {
            $this->validationErrors = false;

            if(!isset($user->user->email) || !$user->user->email) {
                $this->validationErrors['email'] =
                    "Please enter an email address.";
            } elseif(self::findFirst(array('conditions' => "email = ?1",
                                           'bind' => array(1 => $user->user->email)))) {
                $this->validationErrors['email'] =
                    "Email address is already in use.";
            }

            if(!isset($user->user->password) || !$user->user->password) {
                $this->validationErrors['password'] =
                    "Please enter a password.";
            }

            if(!isset($user->user->repeat_password) ||
               !$user->user->repeat_password) {
                $this->validationErrors['repeat_password'] =
                    "Please enter password again.";
            } elseif(!isset($this->validationErrors['password']) &&
                     $user->user->repeat_password != $user->user->password) {

                $this->validationErrors['password'] =
                    "Passwords do not match.";
                $this->validationErrors['repeat_password'] =
                    "Passwords do not match.";
            }

            if(!isset($user->user->name) || !$user->user->name) {
                $this->validationErrors['name'] = "Please enter a name.";
            }

            if(!isset($user->user->date_of_birth) ||
               !$user->user->date_of_birth) {
                $this->validationErrors['date_of_birth'] =
                    "Please enter a date of birth.";
            } elseif(!strtotime($user->user->date_of_birth)) {
                $this->validationErrors['date_of_birth'] =
                    "Please enter a valid date of birth.";
            }

            if(!isset($user->user->sex) || !$user->user->sex ||
               !in_array($user->user->sex, array('Male', 'Female'))) {
                $this->validationErrors['sex'] = "Please select a sex.";
            }

            if(!isset($user->user->height) || !$user->user->height) {
                $this->validationErrors['height'] = "Please enter a height.";
            } elseif((int)$user->user->height <= 0) {
                $this->validationErrors['height'] =
                    "Please enter a positive integer value for height.";
            }

            if(!isset($user->user->weight) || !$user->user->weight) {
                $this->validationErrors['weight'] = "Please enter a weight.";
            } elseif((float)$user->user->weight <= 0) {
                $this->validationErrors['weight'] =
                    "Please enter a positive decimal value for weight.";
            }

            return !$this->validationErrors;

        }
        //end isValidUser

    }
