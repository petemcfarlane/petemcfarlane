<?php

class SculpinKernel extends \Sculpin\Bundle\SculpinBundle\HttpKernel\AbstractKernel
{
    protected function getAdditionalSculpinBundles()
    {
        return [
            'PeteMc\Sculpin\SculpinGulpBundle\SculpinGulpBundle'
        ];
    }
}