<?php

namespace counseling\Controller\User;

use counseling\Factory\Visit as Factory;
use counseling\Resource\Visit as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Visit extends \counseling\Controller\Base
{
    public function post(\Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Reason command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'create':
                $this->create();
                break;
        }
        $view = new \phpws2\View\JsonView(array('success' => true));
        $response = new \Canopy\Response($view);

        return $response;
    }

    private function create()
    {
        $visitor_id = Factory::pullPostInteger('visitorId');
        $reason_id = Factory::pullPostInteger('reasonId');
        $location_id = Factory::pullPostInteger('locationId');
        $emergency = Factory::pullPostCheck('emergency');

        $reason = \counseling\Factory\Reason::build($reason_id);
        $reason->getCategory();
        $visit = new Resource();
        $visit->stampArrivalTime();
        $visit->setCategory($reason->getCategory());
        $visit->setHasEmergency($emergency);
        $visit->setLocation($location_id);
        $visit->setReasonId($reason_id);
        $visit->setVisitorId($visitor_id);
        Factory::saveResource($visit);
    }
}
