<?php

namespace counseling\Controller\Admin;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Dashboard extends \counseling\Controller\Base
{

    public function get(\Request $request)
    {
        $command = $this->routeCommand($request);
        if (empty($command)) {
            return parent::get($request);
        } else {
            return $command->get($request);
        }
    }

    public function post(\Request $request)
    {
        $command = $this->routeCommand($request);
        if (empty($command)) {
            return parent::post($request);
        } else {
            return $command->post($request);
        }
    }

    public function getHtmlView($data, \Request $request)
    {
        if (COUNSELING_REACT_DEV) {
            $script[] = \counseling\Factory\React::development('Admin/FrontDesk/', 'script.js');
        } else {
            $script[] = \counseling\Factory\React::production('Admin/FrontDesk/', 'script.min.js');
        }
        $react = implode("\n", $script);
        \Layout::addStyle('counseling', 'Admin/Dashboard/style.css');

        $settings = \Current_User::isDeity() ? 'true' : 'false';

        $icons = json_encode(\counseling\Factory\Base::categoryIcons());
        $content = <<<EOF
<script type="text/javascript">
    var settingsAllowed = $settings;
    var categoryIcons = $icons;
</script>
<div id="dashboard"></div>
$react
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

    private function routeCommand($request)
    {
        $command = $request->shiftCommand();

        if (empty($command)) {
            return null;
        }

        $className = 'counseling\Controller\Admin\Dashboard\\' . $command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());
        return $commandObject;
    }

}
