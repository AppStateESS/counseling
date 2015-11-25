<?php

namespace counseling\Factory;

use counseling\Resource\Clinician as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Clinician extends Base
{

    public static function getList($active_only=true)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_clinician');
        $tbl->addFieldConditional('active', 1);
        $tbl->addOrderBy('last_name');
        return $db->select();
    }

    public static function post()
    {
        $clinician_id = filter_input(INPUT_POST, 'clinicianId', FILTER_SANITIZE_NUMBER_INT);
        $clinician = self::build($clinician_id);
        $clinician->setFirstName(self::pullPostString('firstName'));
        $clinician->setLastName(self::pullPostString('lastName'));
        
        self::saveResource($clinician);
    }

    public static function build($id = 0)
    {
        $clinician = new Resource;
        if ($id) {
            $clinician->setId($id);
            parent::loadByID($clinician);
        }
        return $clinician;
    }
    
    public static function delete($id)
    {
        $clinician = self::build($id);
        $clinician->setActive(false);
        self::saveResource($clinician);
    }

}
