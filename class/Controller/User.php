<?php

namespace counseling\Controller;

use counseling\Factory\React;

require_once PHPWS_SOURCE_DIR . 'mod/counseling/conf/defines.php';

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
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
        $className = 'counseling\Controller\User\\' . $command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());

        return $commandObject;
    }

    public function checkin()
    {
        $session = \phpws2\Session::getInstance();
        try {
            $currentLocation = $session->defaultCounselingLocation;
        } catch (\Exception $ex) {
            $currentLocation = 0;
        }

        if ($currentLocation === 0) {
            return $this->selectLocation();
        } else {
            $react = new React;
            $script = $react->scriptView('Checkin');
            \Layout::addStyle('counseling', 'User/style.css');

            return "<script>const currentLocation = $currentLocation;</script>$script";
        }
    }
    
    private function selectLocation() {
        $factory = new \counseling\Factory\Location();
        $locations = $factory->listLocations();
        if (empty($locations)) {
            return '<p>No locations created. Check Settings under the administrator section.</p>';
        }
        
        $vars['locations'] = $locations;
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('counseling', 'User/location.html');
        return $template->get();
    }

}
