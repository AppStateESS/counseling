<?php

namespace counseling\Controller\Admin;

use counseling\Factory\Report as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Report extends \counseling\Controller\Base
{
    public function getHtmlView($data, \Request $request)
    {
        $content = Factory::view();
        $view = new \View\HtmlView($content);
        return $view;
    }
}
