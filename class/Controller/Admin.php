<?php

namespace counseling\Controller;

require_once PHPWS_SOURCE_DIR . 'mod/counseling/conf/defines.php';

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Admin extends \Http\Controller
{

    public function get(\Request $request)
    {
        $command = $this->routeCommand($request);
        return $command->get($request);
    }

    public function post(\Request $request)
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

        $className = 'counseling\Controller\Admin\\' . $command;
        if (!class_exists($className)) {
            throw new \Http\NotAcceptableException($request);
        }
        $commandObject = new $className($this->getModule());
        return $commandObject;
    }

}
