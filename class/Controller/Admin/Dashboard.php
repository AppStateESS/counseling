<?php

namespace counseling\Controller\Admin;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Dashboard extends \counseling\Controller\Base
{
    public function getHtmlView($data, \Request $request)
    {
        if (COUNSELING_REACT_DEV) {
            \counseling\Factory\React::load('Admin/FrontDesk/', 'Summary.jsx');
            \counseling\Factory\React::load('Admin/FrontDesk/', 'Waiting.jsx');
            \counseling\Factory\React::load('Admin/FrontDesk/', 'Dashboard.jsx');
        }
        
        $settings = \Current_User::isDeity() ? 'true' : 'false';
        
        $content = <<<EOF
<script type="text/javascript">var settingsAllowed = $settings;</script>
<div id="dashboard"></div>
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

}
