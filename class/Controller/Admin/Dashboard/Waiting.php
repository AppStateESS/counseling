<?php

namespace counseling\Controller\Admin\Dashboard;

use counseling\Factory\Visitor as VisitorFactory;
use counseling\Factory\Visit as VisitFactory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Waiting extends \counseling\Controller\Base
{

    protected function getJsonView($data, \Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown JSON command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = $this->getLists();
                break;
        }

        $view = new \View\JsonView($json);
        return $view;
    }

    public function post(\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown post command');
        }

        switch ($request->getVar('command')) {
            case 'intakeComplete':
                VisitorFactory::intakeComplete(VisitorFactory::pullPostInteger('visitorId'));
                break;
        }
        
        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }

    /**
     * Returns waiting and emergency lists
     */
    private function getLists()
    {
        $json['emergencyList'] = VisitFactory::getCurrentVisits(true);
        $json['waitingList'] = VisitFactory::getCurrentVisits(false);

        return $json;
    }

}
