<?php

/*
 * Copyright (C) 2017 Matthew McNaney <mcnaneym@appstate.edu>.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */

namespace counseling\Controller\Admin\Settings;

use counseling\Factory\Location as Factory;

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Location extends \counseling\Controller\Base
{

    protected function getJsonView($data, \Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Settings command');
        }
        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = Factory::listLocations();
                break;

            default:
                throw new \Exception('Unknown command');
        }

        $view = new \phpws2\View\JsonView($json);
        return $view;
    }

    public function post(\Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Location command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'setTitle':
                $this->setTitle();
                break;

            case 'delete':
                if (\Current_User::isDeity()) {
                    Factory::delete(filter_input(INPUT_POST, 'locationId',
                                    FILTER_SANITIZE_NUMBER_INT));
                } else {
                    throw new \Exception('Action not allowed');
                }
                break;
        }
        $view = new \phpws2\View\JsonView(array('success' => true));
        $response = new \Canopy\Response($view);

        return $response;
    }

    private function setTitle()
    {
        $reason = Factory::loadByPost();
        $reason->setTitle(Factory::pullPostString('title'));
        Factory::saveResource($reason);
    }

}
