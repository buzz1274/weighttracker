<?php

namespace weighttrackerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class DefaultController extends Controller {

    public function indexAction() {
        return $this->render('weighttrackerBundle::loader.html.twig');
    }

    public function registerAction() {
        $request = Request::createFromGlobals();
        $data = $request->request->all();

        $response = new JsonResponse(array('name' => 'David'));
        $response->setStatusCode(400);

        return $response;

    }


}
