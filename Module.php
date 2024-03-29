<?php

namespace counseling;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Module extends \Canopy\Module
{

    public function __construct()
    {
        parent::__construct();
        $this->setTitle('counseling');
        $this->setProperName('Counseling Center Check-In');
    }

    public function beforeRun(\Canopy\Request $request, \Canopy\Controller $controller)
    {
        $this->checkDefine();
    }

    private function checkDefine()
    {
        static $checked = false;
        if ($checked) {
            return;
        }
        $define_file = PHPWS_SOURCE_DIR . 'mod/counseling/conf/defines.php';
        if (!is_file($define_file)) {
            exit('Counseling requires a copy of conf/defines.php to be created.');
        }
        $checked = true;
        require_once $define_file;
        require_once PHPWS_SOURCE_DIR . 'mod/counseling/conf/system_defines.php';
    }

    public function getController(\Canopy\Request $request)
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

    public function runTime(\Canopy\Request $request)
    {
        $this->checkDefine();
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
