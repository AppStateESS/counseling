<?php

namespace counseling\Controller\User;

use counseling\Factory\Reason;
use counseling\Factory\Visitor;
use counseling\Factory\Visit;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Checkin extends \counseling\Controller\Base
{

    protected function getJsonView($data, \Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown JSON command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'loginVisitor':
                $json = $this->loginVisitor();
                break;

            case 'instructions':
                $json = Reason::getInstructionList();
                break;
        }

        $view = new \phpws2\View\JsonView($json);

        return $view;
    }

    private function loginVisitor()
    {
        $banner_id = filter_input(INPUT_GET, 'studentBannerId', FILTER_SANITIZE_STRING);
        if (strlen($banner_id) < 9) {
            return;
        }
        $waiting = Visit::getWaitingByBanner($banner_id);

        if (!empty($waiting)) {
            return array('waiting' => true);
        }

        $visitor = Visitor::getByBannerId($banner_id);
        if (empty($visitor)) {
            $visitor = Visitor::createFromBanner($banner_id);
        }

        if (empty($visitor)) {
            return;
        } else {
            $jsonVisitor = $visitor->getStringVars();
            return $jsonVisitor;
        }
    }

    public function post(\Canopy\Request $request)
    {
        $session = \phpws2\Session::getInstance();
        $session->defaultCounselingLocation = $request->pullPostInteger('location');
        \Canopy\Server::forward('./');
    }

}
