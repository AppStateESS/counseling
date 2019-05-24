<?php

namespace counseling\Controller\Admin;

use counseling\Factory\React;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Settings extends \counseling\Controller\Base
{
    public function get(\Canopy\Request $request)
    {
        if (!\Current_User::isDeity()) {
            throw new \phpws2\Http\NotAcceptableException($request);
        }
        $command = $this->routeCommand($request);
        if (empty($command)) {
            return parent::get($request);
        } else {
            return $command->get($request);
        }
    }

    public function post(\Canopy\Request $request)
    {
        if (!\Current_User::isDeity()) {
            throw new \phpws2\Http\NotAcceptableException($request);
        }
        $command = $this->routeCommand($request);
        if (empty($command)) {
            return parent::post($request);
        } else {
            return $command->post($request);
        }
    }

    public function getHtmlView($data, \Canopy\Request $request)
    {
        javascript('jquery_ui');
        \Layout::addStyle('counseling', 'Admin/style.css');
        
        $react = new React;
        $script = $react->scriptView('Settings');

        \Layout::addStyle('counseling', 'Admin/Settings/style.css');

        $settings = \Current_User::isDeity() ? 'true' : 'false';

        $content = <<<EOF
<script type="text/javascript">const settingsAllowed = $settings;</script>
$script
EOF;
        $view = new \phpws2\View\HtmlView($content);

        return $view;
    }

    private function routeCommand($request)
    {
        $command = $request->shiftCommand();

        if (empty($command)) {
            return;
        }

        $className = 'counseling\Controller\Admin\Settings\\'.$command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());

        return $commandObject;
    }
}
