<?php

namespace counseling\Controller\Admin\Settings;

use counseling\Factory\Clinician as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Clinician extends \counseling\Controller\Base
{
    protected function getJsonView($data, \Request $request)
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

    public function post(\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Clinician command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'delete':
                Factory::delete(Factory::pullPostInteger('clinicianId'));
                break;

            case 'sort':
                Factory::sort(Factory::pullPostInteger('moved'), Factory::pullPostInteger('prev'), Factory::pullPostInteger('next'));
                break;

            default:
                throw new \Exception('Unknown Clinician command');
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);

        return $response;
    }
}
