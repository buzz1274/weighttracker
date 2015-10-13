<?php

    use Phalcon\Session\Adapter\Files as Session;

    class controller {

        protected $app = false;
        protected $response = false;
        protected $statusCode = 200;
        protected $statusMessage = 'OK';
        protected $errors = false;
        protected $request = false;

        public function __construct($app) {
            $this->app = $app;
            $this->request = $this->app->request->getJsonRawBody();
        }
        //end __construct

        /**
         * generates the json response to return to the client
         * @param $statusCode
         * @param $statusMessage
         * @param $response
         * @return mixed
         */
        protected function generateResponse($statusCode = false,
                                            $statusMessage = false,
                                            $response = false) {

            if($statusCode) {
                $this->statusCode = $statusCode;
            }

            if($statusMessage) {
                $this->statusMessage = $statusMessage;
            }

            if($response) {
                $this->response = $response;
            }

            $this->app->response->setStatusCode($this->statusCode,
                                                $this->statusMessage);
            $this->app->response->setJsonContent($this->response);

            return $this->app->response;
        }
        //end generateResponse


    }
