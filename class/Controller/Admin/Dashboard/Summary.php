<?php

namespace counseling\Controller\Admin\Dashboard;

use counseling\Factory\Summary as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Summary extends \counseling\Controller\Base
{

    protected function getJsonView($data, \Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown JSON command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'getData':
                $json = Factory::getSummaryData();
                break;
        }

        $view = new \View\JsonView($json);
        return $view;
    }

}
