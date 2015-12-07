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
        if (preg_match('/\D/', $banner_id)) {
            throw new \Exception('Improperly formatted Banner Id');
        }
        $fn = array('Matt', 'Doug', 'Lorrie', 'Sam', 'Morris', 'Elvis', 'Mike', 'Michelle', 'Lisa');
        $ln = array('Douglas', 'Smith', 'Jones', 'Ito', 'Sampson', 'Valdez', 'X', 'Simpson', 'Voggler', 'Husslehip');
        $username = randomString();
        return array(
            'userName' => $username,
            'firstName' => $fn[rand(0, count($fn) - 1)],
            'lastName' => $ln[rand(0, count($ln) - 1)],
            'phoneNumber' => '828' . rand(2620000, 2659999),
            'emailAddress' => $username . '@appstate.edu',
            'studentLevel' => 'U'
        );
    }

    public static function pullByBannerId($banner_id)
    {
        
    }

}
