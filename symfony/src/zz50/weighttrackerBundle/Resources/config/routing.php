<?php

use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;

$collection = new RouteCollection();

$collection->add('weighttracker_homepage', new Route('/hello/{name}', array(
    '_controller' => 'weighttrackerBundle:Default:index',
)));

return $collection;
