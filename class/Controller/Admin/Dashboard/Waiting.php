<?php

namespace counseling\Controller\Admin\Dashboard;

use counseling\Factory\Visitor as VisitorFactory;
use counseling\Factory\Visit as VisitFactory;
use counseling\Factory\Summary as SummaryFactory;

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

            case 'setCompleteReason':
                $this->setCompleteReason();
                break;
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }

    private function setCompleteReason()
    {
        $visit_id = VisitFactory::pullPostInteger('visitId');
        $reason = VisitFactory::pullPostInteger('reason');
        VisitFactory::setCompleteReason($visit_id, $reason);
    }
    
    /**
     * Returns waiting and emergency lists
     */
    private function getLists()
    {
        $waiting = VisitFactory::getCurrentVisits();
        if (empty($waiting)) {
            $json['emergencyList'] = null;
            $json['waitingList'] = null;
            $json['summary'] = null;
        } else {
            $count = 0;
            $emergencies = 0;
            $other = 0;
            $walkin = 0;
            $appointment = 0;

            $now = time();

            foreach ($waiting as $visit) {
                $count++;
                $id = $visit['id'];

                $arrivals[] = $visit['wait_time'];

                if ($visit['has_emergency']) {
                    $json['emergencies'][] = $visit;
                    $emergencies++;
                } else {
                    $json['waiting'][] = $visit;

                    switch ($visit['category']) {
                        case '0':
                            $other++;
                            break;
                        case '1':
                            $walkin++;
                            break;
                        case '2':
                            $appointment++;
                    }
                }
            }

            $summary['totalWaiting'] = $count;
            $summary['estimatedWait'] = SummaryFactory::getEstimatedWait($arrivals);
            $summary['currentTally']['other'] = $other;
            $summary['currentTally']['walkin'] = $walkin;
            $summary['currentTally']['appointment'] = $appointment;
            $summary['currentTally']['emergency'] = $emergencies;

        }
        $summary['totalComplete'] = SummaryFactory::totalCompleteToday();
        $summary['averageWait'] = SummaryFactory::averageToday();
        $summary['completeTally'] = SummaryFactory::completeTally();


        $json['summary'] = $summary;

        return $json;
    }

}
