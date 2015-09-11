<?php

    use Phalcon\Mvc\Model;
    use Phalcon\Security as Security;
    use Phalcon\Mvc\Model\Transaction\Manager as TransactionManager;

    class userModel extends Model {

        //db columns
        public $user_id;
        public $email;
        public $password;
        public $name;
        public $date_of_birth;
        public $sex;
        public $height;
        public $account_created;
        public $target_weight;
        private $validationErrors = false;

        public function initialize() {
            $this->setSource('user');
        }

        public function register($user) {

            if(!$this->isValidUser($user, 'register')) {
                return array('errors' => $this->validationErrors);
            }

            $security = new Security();
            $transactionManager = new TransactionManager();

            $today = date('Y-m-d', strtotime('now'));
            $transaction = $transactionManager->get();

            $this->setTransaction($transaction);
            $this->email = $user->user->email;
            $this->password = $security->hash($user->user->password);
            $this->name = $user->user->name;
            $this->date_of_birth = date('Y-m-d', strtotime($user->user->date_of_birth));
            $this->sex = (strtolower($user->user->sex) === 'male' ? 'm' : 'f');
            $this->height = $user->user->height;
            $this->target_weight = $user->user->target_weight;
            $this->account_created = $today;

            try {
                if(!$this->save()) {
                    throw new Exception('failed to save user');
                } else {

                    $weight = new weightModel();

                    $weight->setTransaction($transaction);
                    $weight->user_id = $this->user_id;
                    $weight->weight = $user->user->weight;
                    $weight->weighed_date = $today;

                    if(!$weight->save()) {
                        throw new Exception('failed to save initial weight');
                    }

                    $transaction->commit();

                    return array('user' => array('id' => $this->user_id));

                }
            } catch(Exception $e) {
                $transaction->rollback();
                throw $e;
            }

        }
        //end register

        /**
         * returns user details if email & password match a user
         * @param $email
         * @param $password
         * @return mixed
         */
        public function login($email, $password) {

            $security = new Security();

            if(($user = self::findFirst(['conditions' => "email = ?1",
                                         'bind' => [1 => $email]])) &&
                $security->checkHash($password, $user->password)) {

                return $user;

            } else {
                return false;
            }

        }
        //end login

        /**
         * validate user
         */
        private function isValidUser($user, $validationType) {
            $this->validationErrors = false;

            if(!isset($user->user->email) || !$user->user->email) {
                $this->validationErrors['email'] =
                    "Please enter an email address.";
            } elseif(($validationType == 'register' ||
                     ($validationType == 'edit' && $user->user->email != $user->email)) &&
                      self::findFirst(array('conditions' => "email = ?1",
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

            if(!isset($user->user->target_weight) || !$user->user->target_weight) {
                $this->validationErrors['target_weight'] =
                    "Please enter a target weight.";
            } elseif((float)$user->user->target_weight <= 0) {
                $this->validationErrors['target_weight'] =
                    "Please enter a positive decimal value for target weight.";
            }

            return !$this->validationErrors;

        }
        //end isValidUser

    }
