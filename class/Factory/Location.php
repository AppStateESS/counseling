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

namespace counseling\Factory;
use counseling\Resource\Location as Resource;
/**
 * Description of Location
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Location extends Base
{
    public static function listLocations($active_only = true)
    {
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_location');
        $tbl->addOrderBy('title');
        if ($active_only) {
            $tbl->addFieldConditional('active', 1);
        }
        $result = $db->select();

        return $result;
    }
    
    public static function build($id = 0)
    {
        $location = new Resource();
        if ($id) {
            $location->setId($id);
            if (!parent::loadByID($location)) {
                throw new \Exception('Location id not found:'.$id);
            }
        }

        return $location;
    }
    
    public static function post()
    {
        $location_id = filter_input(INPUT_POST, 'locationId', FILTER_SANITIZE_NUMBER_INT);
        $location = self::build($location_id);
        $location->setTitle(self::pullPostString('title'));

        self::saveResource($location);
    }
    
    public static function delete($location_id)
    {
        $location = self::build($location_id);
        $location->setActive(false);
        self::saveResource($location);
    }
    
    
    public static function loadByPost($varname = 'locationId')
    {
        $reason = new Resource();
        $reason->setId(filter_input(INPUT_POST, $varname,
                        FILTER_SANITIZE_NUMBER_INT));
        self::loadByID($reason);

        return $reason;
    }
}
