<?php

namespace counseling\Controller;

require_once PHPWS_SOURCE_DIR . 'mod/counseling/conf/defines.php';

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class User extends \Http\Controller
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
            $command = 'Checkin';
        }

        $className = 'counseling\Controller\User\\' . $command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());
        return $commandObject;
    }

    public function checkin()
    {
        if (COUNSELING_REACT_DEV) {
            \counseling\Factory\React::load('User/Checkin/', 'Mixins.jsx');
            \counseling\Factory\React::load('User/Checkin/', 'Swipe.jsx');
            \counseling\Factory\React::load('User/Checkin/', 'Reason.jsx');
            \counseling\Factory\React::load('User/Checkin/', 'Phone.jsx');
            \counseling\Factory\React::load('User/Checkin/', 'Emergency.jsx');
            \counseling\Factory\React::load('User/Checkin/', 'Instruction.jsx');
            \counseling\Factory\React::load('User/Checkin/', 'Login.jsx');
        }

        \Layout::addStyle('counseling', 'User/style.css');
        
        $content = <<<EOF
<div id="Login"></div>
EOF;
        return $content;
    }

}
