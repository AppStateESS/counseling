<?php

namespace counseling;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Module extends \Module implements \SettingDefaults
{

    public function __construct()
    {
        parent::__construct();
        $this->setTitle('counseling');
        $this->setProperName('Counseling Center Check-In');
    }

    public function beforeRun(\Request $request, \Controller $controller)
    {
        require_once PHPWS_SOURCE_DIR . 'mod/counseling/conf/defines.php';
    }

    public function getController(\Request $request)
    {
        $cmd = $request->shiftCommand();
        if ($cmd == 'Admin') {
            if (\Current_User::allow('counseling')) {
                $admin = new \counseling\Controller\Admin($this);
                return $admin;
            } else {
                \Current_User::requireLogin();
            }
        } else {
            $user = new \counseling\Controller\User($this);
            return $user;
        }
    }

    public function getSettingDefaults()
    {
        $settings['foo'] = 'bar';
        return $settings;
    }

    public function runTime(\Request $request)
    {
        if (\PHPWS_Core::atHome()) {
            $user = new \counseling\Controller\User($this);
            $content = $user->checkin();
            \Layout::add($content);
        }
    }

}
