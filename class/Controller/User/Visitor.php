<?php

namespace counseling\Controller\User;

use counseling\Factory\Visitor as Factory;
use counseling\Resource\Visitor as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Visitor extends \counseling\Controller\Base
{

    public function post(\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Reason command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'updatePhone':
                $this->updatePhone();
        }
        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }

    private function updatePhone()
    {
        $phone = Factory::pullPostString('phoneNumber');
        $visitor_id = Factory::pullPostInteger('visitorId');

        $visitor = new Resource;
        $visitor->setId($visitor_id);
        Factory::loadByID($visitor);
        $visitor->setPhoneNumber($phone);
        Factory::saveResource($visitor);
    }

}
