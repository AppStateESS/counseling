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
    
    public static function fakeStudent()
    {
        return array(
            'userName' => 'mcnaneym',
            'banner_id' => '123456789',
            'firstName' => 'Matt',
            'lastame' => 'McNaney',
            'phoneNumber' => '8282651010',
            'emailAddress' => 'mcnaneym@appstate.edu',
            'studentLevel' => 'U'
        );
    }
}
