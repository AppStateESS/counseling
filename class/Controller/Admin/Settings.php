<?php

namespace counseling\Controller\Admin;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Settings extends \counseling\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        if (COUNSELING_REACT_DEV) {
            \counseling\Factory\React::load('Admin/Settings/', 'Visitors.jsx');
            \counseling\Factory\React::load('Admin/Settings/', 'Visits.jsx');
            \counseling\Factory\React::load('Admin/Settings/', 'Reasons.jsx');
            \counseling\Factory\React::load('Admin/Settings/', 'Dispositions.jsx');
            \counseling\Factory\React::load('Admin/Settings/', 'Dashboard.jsx');
        }

        $settings = \Current_User::isDeity() ? 'true' : 'false';

        $content = <<<EOF
<div id="settings-dashboard"></div>
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

}
