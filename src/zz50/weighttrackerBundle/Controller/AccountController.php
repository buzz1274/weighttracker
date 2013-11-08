<?php

namespace zz50\weighttrackerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AccountController extends Controller {
    public function registerAction() {
        return $this->render('weighttrackerBundle:Account:register.html.twig');
    }
}
