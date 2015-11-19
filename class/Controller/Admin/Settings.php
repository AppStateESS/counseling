<?php

namespace counseling\Controller\Admin;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Settings extends \counseling\Controller\Base
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
        \Layout::addStyle('counseling', 'Admin/style.css');
        if (COUNSELING_REACT_DEV) {
            \counseling\Factory\React::load('Admin/Settings/', 'Mixins.jsx');
            \counseling\Factory\React::load('Admin/Settings/', 'Visitors.jsx');
            \counseling\Factory\React::load('Admin/Settings/', 'Visits.jsx');
            \counseling\Factory\React::load('Admin/Settings/', 'Reasons.jsx');
            \counseling\Factory\React::load('Admin/Settings/', 'Dispositions.jsx');
            \counseling\Factory\React::load('Admin/Settings/', 'Dashboard.jsx');
        }

        \Layout::addStyle('counseling', 'Admin/Settings/style.css');
        
        $settings = \Current_User::isDeity() ? 'true' : 'false';
        
        $content = <<<EOF
<script type="text/javascript">var settingsAllowed = $settings;</script>
<div id="settings-dashboard"></div>
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

    public function getJsonView($data, \Request $request)
    {
        return parent::getJsonView($data, $request);
    }

    private function routeCommand($request)
    {
        $command = $request->shiftCommand();

        if (empty($command)) {
            return null;
        }

        $className = 'counseling\Controller\Admin\Settings\\' . $command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());
        return $commandObject;
    }

}
