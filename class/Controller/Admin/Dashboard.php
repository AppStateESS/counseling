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
            \counseling\Factory\React::load('Admin/FrontDesk/', 'Mixins.jsx');
            \counseling\Factory\React::load('Admin/FrontDesk/', 'Summary.jsx');
            \counseling\Factory\React::load('Admin/FrontDesk/', 'Emergency.jsx');
            \counseling\Factory\React::load('Admin/FrontDesk/', 'Waiting.jsx');
            \counseling\Factory\React::load('Admin/FrontDesk/', 'Dashboard.jsx');
        }

        \Layout::addStyle('counseling', 'Admin/Dashboard/style.css');
        
        $settings = \Current_User::isDeity() ? 'true' : 'false';

        $content = <<<EOF
<script type="text/javascript">var settingsAllowed = $settings;</script>
<div id="dashboard"></div>
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
