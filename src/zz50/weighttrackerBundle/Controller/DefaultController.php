<?php

namespace zz50\weighttrackerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name = 'fred')
    {
        return $this->render('weighttrackerBundle:Default:index.html.twig', array('name' => $name));
    }
}
