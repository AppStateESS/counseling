<?php

namespace counseling\Controller\User;

use counseling\Factory\Visit as Factory;
use counseling\Resource\Visit as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Visit extends \counseling\Controller\Base
{

    public function post(\Request $request)
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
        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }
    
    private function create()
    {
        $visitor_id = Factory::pullPostInteger('visitorId');
        $reason_id = Factory::pullPostInteger('reasonId');
        $emergency = Factory::pullPostCheck('emergency');
        
        $reason = \counseling\Factory\Reason::build($reason_id);
        if ($reason->getWaitListed()) {
            $visit = new Resource;
            $visit->stampArrivalTime();
            $visit->setHasEmergency($emergency);
            $visit->setReasonId($reason_id);
            $visit->setVisitorId($visitor_id);
            Factory::saveResource($visit);
        }
    }

}
