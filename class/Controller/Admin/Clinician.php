<?php

namespace counseling\Controller\Admin;

use counseling\Factory\Clinician as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Clinician extends \counseling\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        \Layout::addStyle('counseling', 'Admin/style.css');
        if (COUNSELING_REACT_DEV) {
            \counseling\Factory\React::load('Admin/Clinician/', 'Choose.jsx');
            \counseling\Factory\React::load('Admin/Clinician/', 'Dashboard.jsx');
        }

        $content = <<<EOF
<div id="clinician-dashboard"></div>
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

    public function getJSONView($data, \Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Settings command');
        }
        $json = array('success' => true);

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = Factory::getList();
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }

}
