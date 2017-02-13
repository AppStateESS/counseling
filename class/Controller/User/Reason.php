<?php

namespace counseling\Controller\User;

use counseling\Factory\Reason as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Reason extends \counseling\Controller\Base
{
    protected function getJsonView($data, \Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown JSON command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = Factory::listReasons();
                break;
        }

        $view = new \phpws2\View\JsonView($json);

        return $view;
    }
}
