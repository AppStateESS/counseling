<?php

namespace counseling\Controller\Admin\Settings;

use counseling\Factory\Disposition as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Disposition extends \counseling\Controller\Base
{
    protected function getJsonView($data, \Canopy\Request $request)
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

            default:
                throw new \Exception('Unknown command');
        }

        $view = new \View\JsonView($json);

        return $view;
    }

    public function post(\Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Disposition command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'delete':
                Factory::delete(Factory::pullPostInteger('dispositionId'));
                break;

            case 'sort':
                Factory::sort(Factory::pullPostInteger('moved'), Factory::pullPostInteger('prev'),
                        Factory::pullPostInteger('next'));
                break;

            default:
                throw new \Exception('Unknown Disposition command');
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);

        return $response;
    }
}
