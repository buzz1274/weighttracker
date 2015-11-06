<?php

    use Mailgun\Mailgun;

    class mail {

        private $mgClient = false;
        private $fromEmailAddress = false;
        private $mgDomain = false;

        public function __construct() {
            $this->mgClient = new Mailgun(MAILGUN_API_KEY);
            $this->mgDomain = MAILGUN_DOMAIN;
            $this->fromEmailAddress = EMAIL_ADDRESS;
        }
        //end __construct

        /**
         * send an email using mailgun's API
         * @param $to
         * @param $subject
         * @param $template
         * @param $variables
         * @return bool
         * @throws \Mailgun\Messages\Exceptions\MissingRequiredMIMEParameters
         * @throws Exception
         */
        public function send($to, $subject, $template, $variables) {

            if(!($text = $this->template($template, 'text', $variables)) ||
               !($html = $this->template($template, 'html', $variables))) {
                throw new Exception('invalid Email template');
            }


            $result = $this->mgClient->sendMessage($this->mgDomain,
                        array('from'    => $this->fromEmailAddress,
                              'to'      => $to,
                              'subject' => $subject,
                              'text'    => $text,
                              'html'    => $html
            ));

            if(is_object($result) && isset($result->http_response_code) &&
               $result->http_response_code === 200) {
                return true;
            } else {
                return false;
            }

        }
        //end send

        /**
         * loads email template and
         * @param $template
         * @param $templateType
         * @param $variables
         * @return string|bool
         */
        private function template($template, $templateType, $variables) {
            if($templateType == 'text') {
                $template .= '.txt';
            } else {
                $template .= '.'.strtolower($templateType);
            }

            $template = dirname(__FILE__).'/../templates/email/'.$template;

            if(!file_exists($template)) {
                return false;
            }

            $email = file_get_contents($template);

            foreach($variables as $key => $value) {
                $email = preg_replace('/'.preg_quote('{{'.$key.'}}').'/is',
                                      $value, $email);
            }

            return $email;

        }
        //end template



    }
