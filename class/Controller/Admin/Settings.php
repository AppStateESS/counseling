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
        if (!\Current_User::isDeity()) {
            throw new \Http\NotAcceptableException($request);
        }
        $command = $this->routeCommand($request);
        if (empty($command)) {
            return parent::get($request);
        } else {
            return $command->get($request);
        }
    }

    public function post(\Request $request)
    {
        if (!\Current_User::isDeity()) {
            throw new \Http\NotAcceptableException($request);
        }
        $command = $this->routeCommand($request);
        if (empty($command)) {
            return parent::post($request);
        } else {
            return $command->post($request);
        }
    }

    public function getHtmlView($data, \Request $request)
    {
        javascript('jquery_ui');
        \Layout::addStyle('counseling', 'Admin/style.css');
        if (COUNSELING_REACT_DEV) {
            $script[] = \counseling\Factory\React::development('Admin/Settings/', 'script.js');
        } else {
            $script[] = \counseling\Factory\React::production('Admin/Settings/', 'script.min.js');
        }
        $react = implode("\n", $script);

        \Layout::addStyle('counseling', 'Admin/Settings/style.css');

        $settings = \Current_User::isDeity() ? 'true' : 'false';

        $content = <<<EOF
<script type="text/javascript">var settingsAllowed = $settings;</script>
<div id="settings-dashboard"></div>
$react
EOF;
        $view = new \View\HtmlView($content);

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
