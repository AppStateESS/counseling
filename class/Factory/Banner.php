<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Banner
{

    public static function pullByFakeBannerId($banner_id)
    {
        if ($banner_id == '123456789') {
            return array(
                'userName' => 'mcnaneym',
                'firstName' => 'Matt',
                'lastName' => 'McNaney',
                'phoneNumber' => '8282651010',
                'emailAddress' => 'mcnaneym@appstate.edu',
                'studentLevel' => 'U'
            );
        }
    }

    public static function pullByBannerId($banner_id)
    {
        
    }

}
