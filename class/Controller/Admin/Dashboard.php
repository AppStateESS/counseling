<?php

namespace counseling\Controller\Admin;
use counseling\Factory\React;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Dashboard extends \counseling\Controller\Base
{
    public function get(\Canopy\Request $request)
    {
        $command = $this->routeCommand($request);
        if (empty($command)) {
            return parent::get($request);
        } else {
            return $command->get($request);
        }
    }

    public function post(\Canopy\Request $request)
    {
        $command = $this->routeCommand($request);
        if (empty($command)) {
            return parent::post($request);
        } else {
            return $command->post($request);
        }
    }

    public function getHtmlView($data, \Canopy\Request $request)
    {
        $react = new React;
        $script = $react->scriptView('FrontDesk');
        \Layout::addStyle('counseling', 'Admin/Dashboard/style.css');

        $settings = \Current_User::isDeity() ? 'true' : 'false';

        $icons = json_encode(\counseling\Factory\Base::categoryIcons());
        $content = <<<EOF
<script type="text/javascript">
    var settingsAllowed = $settings;
    var categoryIcons = $icons;
</script>
<div id="dashboard"></div>
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

        $className = 'counseling\Controller\Admin\Dashboard\\'.$command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());

        return $commandObject;
    }
}
