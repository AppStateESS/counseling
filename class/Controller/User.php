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
            $script[] = \counseling\Factory\React::development('User/Checkin/', 'Mixins.jsx');
            $script[] = \counseling\Factory\React::development('User/Checkin/', 'Swipe.jsx');
            $script[] = \counseling\Factory\React::development('User/Checkin/', 'Reason.jsx');
            $script[] = \counseling\Factory\React::development('User/Checkin/', 'Phone.jsx');
            $script[] = \counseling\Factory\React::development('User/Checkin/', 'Emergency.jsx');
            $script[] = \counseling\Factory\React::development('User/Checkin/', 'Instruction.jsx');
            $script[] = \counseling\Factory\React::development('User/Checkin/', 'Login.jsx');
        } else {
            $script[] = \counseling\Factory\React::production('User/Checkin/', 'script.js');
        }
        $react = implode("\n", $script);
        \Layout::addStyle('counseling', 'User/style.css');
        
        $content = <<<EOF
<div id="Login"></div>
$react
EOF;
        return $content;
    }

}
