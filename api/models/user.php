<?php

    use Phalcon\Mvc\Model;

    class user extends Model {

        private $validationErrors = false;

        public function register($user) {

            error_log("USER");
            error_log(json_encode($user));

            if(!$this->isValidUser($user)) {
                return array('errors' => $this->validationErrors);
            }

            return array('user' => array('id' => 1));

        }

        private function isValidUser($user) {
            $this->validationErrors = false;

            if(!isset($user->user->email) || !$user->user->email) {
                $this->validationErrors['email'] =
                    "Please enter an email address.";
            }

            if(!isset($user->user->password) || !$user->user->password) {
                $this->validationErrors['password'] =
                    "Please enter a password.";
            }

            if(!isset($user->user->repeat_password) ||
               !$user->user->repeat_password) {
                $this->validationErrors['repeat_password'] =
                    "Please enter password again.";
            } elseif($user->user->repeat_password !=
                     $user->user->password) {

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
            }

            if(!isset($user->user->sex) || !$user->user->sex ||
               $user->user->sex === '-') {
                $this->validationErrors['sex'] = "Please select a sex.";
            }

            if(!isset($user->user->height) || !$user->user->height) {
                $this->validationErrors['height'] = "Please enter a height.";
            }

            if(!isset($user->user->weight) || !$user->user->weight) {
                $this->validationErrors['weight'] = "Please enter a weight.";
            } elseif((float)$user->user->weight <= 0) {
                $this->validationErrors['weight'] = "Please enter a weight.";
            }

            return !$this->validationErrors;

        }
        //end isValidUser

    }
