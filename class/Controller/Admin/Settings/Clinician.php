<?php

namespace counseling\Controller\Admin\Settings;

use counseling\Factory\Clinician as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Clinician extends \counseling\Controller\Base
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
        }
        $view = new \phpws2\View\JsonView($json);

        return $view;
    }

    public function post(\Canopy\Request $request)
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

        $view = new \phpws2\View\JsonView(array('success' => true));
        $response = new \Canopy\Response($view);

        return $response;
    }
}
