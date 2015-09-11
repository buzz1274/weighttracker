<?php

    use Phalcon\Session\Adapter\Files as Session;

    class controller {

        protected $app = false;
        protected $response = false;
        protected $statusCode = 200;
        protected $statusMessage = 'OK';
        protected $errors = false;
        protected $request = false;
        protected $session = false;

        public function __construct($app) {
            $this->app = $app;
            $this->request = $this->app->request->getJsonRawBody();
        }
        //end __construct

        /**
         * generates the json response to return to the client
         * @return mixed
         */
        protected function generateResponse() {

            $this->app->response->setStatusCode($this->statusCode,
                                                $this->statusMessage);
            $this->app->response->setJsonContent($this->response);

            return $this->app->response;
        }
        //end generateResponse


    }
