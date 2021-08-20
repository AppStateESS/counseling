<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
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
        $username = \Canopy\TextString::randomString();

        return array(
            'userName' => $username,
            'firstName' => $fn[rand(0, count($fn) - 1)],
            'preferredName' => $fn[rand(0, count($fn) - 1)],
            'lastName' => $ln[rand(0, count($ln) - 1)],
            'phoneNumber' => '828' . rand(2620000, 2659999),
            'emailAddress' => $username . '@appstate.edu',
            'studentLevel' => 'U',
        );
    }

    public static function isError($vars)
    {
        return empty($vars) || count($vars) < 2 || isset($vars['Message']);
    }

    public static function pullByBannerId($banner_id)
    {
        require_once PHPWS_SOURCE_DIR . 'mod/counseling/conf/defines.php';

        $pluggedUrl = str_replace('{id}', $banner_id, COUNSELING_BANNER_URL);

        $curl = curl_init();
        curl_setopt_array($curl, array(CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $pluggedUrl,
            CURLOPT_FAILONERROR => 1,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0));


        $jsonResult = curl_exec($curl);
        $result = json_decode($jsonResult);

        if (empty($result)) {
            return false;
        } else {
            return (array) $result;
        }
    }

}
