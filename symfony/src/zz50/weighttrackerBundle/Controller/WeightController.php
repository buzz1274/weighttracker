<?php

namespace zz50\weighttrackerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class WeightController extends Controller {
    public function indexAction() {
        return $this->render('weighttrackerBundle:Weight:weight.html.twig');
    }
}
