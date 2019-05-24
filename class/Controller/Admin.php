<?php

namespace counseling\Controller;

require_once PHPWS_SOURCE_DIR.'mod/counseling/conf/defines.php';

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Admin extends \phpws2\Http\Controller
{
    public function get(\Canopy\Request $request)
    {
        $command = $this->routeCommand($request);

        return $command->get($request);
    }

    public function post(\Canopy\Request $request)
    {
        $command = $this->routeCommand($request);

        return $command->post($request);
    }

    private function routeCommand($request)
    {
        $command = $request->shiftCommand();

        if (empty($command)) {
            $command = 'Dashboard';
        }

        $className = 'counseling\Controller\Admin\\'.$command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());

        return $commandObject;
    }

    public static function loadAdminBar()
    {
        $auth = \Current_User::getAuthorization();

        $vars['is_deity'] = \Current_User::isDeity();
        $vars['logout_uri'] = $auth->logout_link;
        $vars['username'] = \Current_User::getDisplayName();
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('counseling', 'Admin/navbar.html');
        $content = $template->get();
        \Layout::plug($content, 'NAV_LINKS');
    }
}
