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
        $autoload = PHPWS_SOURCE_DIR . 'mod/counseling/vendor/autoload.php';
        if (!is_file($autoload)) {
            exit('Counseling requires "composer install" to be run in module directory');
        }
        require_once $autoload;
        parent::__construct();
        $this->setTitle('counseling');
        $this->setProperName('Counseling Center Check-In');
    }

    public function beforeRun(\Request $request, \Controller $controller)
    {
        $define_file = PHPWS_SOURCE_DIR . 'mod/counseling/conf/defines.php';
        if (!is_file($define_file)) {
            exit('Counseling requires a copy of conf/defines.php to be created.');
        }
        require_once $define_file;
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
        if (\Current_User::allow('counseling')) {
            \counseling\Controller\Admin::loadAdminBar();
        }
    }

}
