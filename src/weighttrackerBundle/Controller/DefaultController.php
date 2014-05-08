<?php

namespace weighttrackerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends Controller {

    public function indexAction() {
        return $this->render('weighttrackerBundle::loader.html.twig');
    }

    public function registerAction() {
        return new JsonResponse(array('name' => 'David'));
    }


}
