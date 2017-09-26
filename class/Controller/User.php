<?php

namespace counseling\Controller;
use counseling\Factory\React;

require_once PHPWS_SOURCE_DIR.'mod/counseling/conf/defines.php';

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class User extends \phpws2\Http\Controller
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
            $command = 'Checkin';
        }

        $className = 'counseling\Controller\User\\'.$command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());

        return $commandObject;
    }

    public function checkin()
    {
        $react = new React;
        $script = $react->scriptView('Checkin');
        \Layout::addStyle('counseling', 'User/style.css');

        return $script;
    }
}
