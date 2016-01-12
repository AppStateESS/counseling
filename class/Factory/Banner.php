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
        $fn = array('Matt', 'Doug', 'Lorrie', 'Sam', 'Morris', 'Elvis', 'Mike', 'Michelle', 'Lisa', 'Greg', 'Juan', 'Jacob');
        $ln = array('Douglas', 'Smith', 'Jones', 'Ito', 'Sampson', 'Valdez', 'Dallas', 'Simpson', 'Voggler', 'Husslehip', 'Nichols');
        $username = randomString();
        return array(
            'userName' => $username,
            'firstName' => $fn[rand(0, count($fn) - 1)],
            'preferredName' => $fn[rand(0, count($fn) - 1)],
            'lastName' => $ln[rand(0, count($ln) - 1)],
            'phoneNumber' => '828' . rand(2620000, 2659999),
            'emailAddress' => $username . '@appstate.edu',
            'studentLevel' => 'U'
        );
    }
    
    public static function isError($vars)
    {
        return (empty($vars) || count($vars) < 2 || isset($vars['Message']));
    }

    private static function prune($vars)
    {
        $intersect = array(
            'userName'=>1,
            'emailAddress'=>1, 
            'preferredName'=>1, 
            'firstName'=>1,
            'lastName'=>1,
            'phoneNumber'=>1,
            'studentLevel'=>1);
        return array_intersect_key($vars, $intersect);
    }
    
    public static function pullByBannerId($banner_id)
    {
        require_once PHPWS_SOURCE_DIR . 'mod/counseling/conf/defines.php';
        
        $client = new \Guzzle\Http\Client(COUNSELING_BANNER_URL);
        $request = $client->get($banner_id);
        $response = $request->send();
        $result = $response->json();
        if (empty($result['userName'])) {
            return false;
        } else {
            return self::prune($result);
        }
    }

}
