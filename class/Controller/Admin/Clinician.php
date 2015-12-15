<?php

namespace counseling\Controller\Admin;

use counseling\Factory\Clinician as Factory;
use counseling\Factory\Visit as VisitFactory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Clinician extends \counseling\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        \Layout::addStyle('counseling', 'Admin/Clinician/style.css');

        $icons = json_encode(\counseling\Factory\Base::categoryIcons());

        if (COUNSELING_REACT_DEV) {
            \counseling\Factory\React::development('Admin/Clinician/', 'CompleteVisit.jsx');
            \counseling\Factory\React::development('Admin/Clinician/', 'SelectVisitor.jsx');
            \counseling\Factory\React::development('Admin/Clinician/', 'ClinicianChoose.jsx');
            \counseling\Factory\React::development('Admin/Clinician/', 'Dashboard.jsx');
        } else {
            \counseling\Factory\React::production('Admin/Clinician/', 'script.min.js');
        }

        $content = <<<EOF
<script type="text/javascript">
    var categoryIcons = $icons;
</script>
<div id="clinician-dashboard"></div>
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

    public function post(\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown post command');
        }

        switch ($request->getVar('command')) {
            case 'selectVisit':
                VisitFactory::attachClinician(Factory::pullPostInteger('visitId'),
                        Factory::pullPostInteger('clinicianId'));
                break;
            
            case 'assignDisposition':
                VisitFactory::setDisposition(Factory::pullPostInteger('visitId'), Factory::pullPostInteger('dispositionId'));
                break;
            
            default:
                throw new \Exception('Unknown post command');
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }

    public function getJSONView($data, \Request $request)
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
            
            case 'currentlySeen':
                $json = $this->currentlySeen();
                break;

            case 'visitorList':
                $json = $this->getVisits();
                break;
            
            case 'dispositionList':
                $json = \counseling\Factory\Disposition::getList();
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }

    private function currentlySeen()
    {
        $clinician_id = Factory::pullGetInteger('clinicianId');
        $visit = Factory::getCurrentlySeen($clinician_id);
        return $visit;
    }
    
    private function getVisits()
    {
        $visits = VisitFactory::getCurrentVisits();
        if (empty($visits)) {
            return null;
        }

        foreach ($visits as $visit) {
            if ($visit['has_emergency']) {
                $json['emergencies'][] = $visit;
            } else {
                $json['waiting'][] = $visit;
            }
        }
        return $json;
    }

}
