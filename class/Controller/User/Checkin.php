<?php

namespace counseling\Controller\User;

use counseling\Factory\Banner;
use counseling\Factory\Reason;
use counseling\Factory\Visitor;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Checkin extends \counseling\Controller\Base
{

    protected function getJsonView($data, \Request $request)
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

        $view = new \View\JsonView($json);
        return $view;
    }

    private function loginVisitor()
    {
        $banner_id = filter_input(INPUT_GET, 'bannerId', FILTER_SANITIZE_STRING);

        $visitor = Visitor::getByBannerId($banner_id);
        if (empty($visitor)) {
            $visitor = Visitor::createFromBanner($banner_id);
        }

        if (empty($visitor)) {
            return null;
        } else {
            $jsonVisitor = $visitor->getStringVars();
            return $jsonVisitor;
        }
    }

}
