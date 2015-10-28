<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Banner
{

    public static function logInById($id)
    {
    }
    
    public static function logInByEmail($email)
    {
    }
    
    public static function fakeStudent()
    {
        return array(
            'username' => 'mcnaneym',
            'banner_id' => '123456789',
            'firstname' => 'Matt',
            'lastname' => 'McNaney',
            'email' => 'mcnaneym@appstate.edu',
            'errornum' => 0,
            'error' => null
        );
    }
}
