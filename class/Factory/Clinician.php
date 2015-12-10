<?php

namespace counseling\Factory;

use counseling\Resource\Clinician as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Clinician extends Base
{

    public static function getList($active_only = true)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_clinician');
        $tbl->addFieldConditional('active', 1);
        $tbl->addOrderBy('sorting');
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
            if (!parent::loadByID($clinician)) {
                throw new \Exception('Clinician id not found:' . $id);
            }
        }
        return $clinician;
    }

    public static function delete($id)
    {
        $clinician = self::build($id);
        $clinician->setActive(false);
        self::saveResource($clinician);
    }

    public static function getCurrentlySeen($clinician_id)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addFieldConditional('clinician_id', $clinician_id);
        $tbl->addFieldConditional('disposition_id', 0);
        $tbl2 = $db->addTable('cc_visitor');
        $tbl2->addField('first_name');
        $tbl2->addField('last_name');
        $db->joinResources($tbl, $tbl2, $db->createConditional($tbl->getField('visitor_id'), $tbl2->getField('id'), '='));

        $result = $db->selectOneRow();
        return $result;
    }

    public static function sort($moved_id, $prev_id, $next_id)
    {
        // decrement sorting number of all previous up to moved

        $moved_obj = self::build($moved_id);
        $moved_sort = $moved_obj->getSorting();

        if (!empty($prev_id)) {
            $prev_obj = self::build($prev_id);
            $prev_sort = $prev_obj->getSorting();
        } else {
            $prev_sort = 0;
        }

        if (!empty($next_id)) {
            $next_obj = self::build($next_id);
            $next_sort = $next_obj->getSorting();
        } else {
            $next_sort = 999;
        }

        $db = \Database::getDB();
        $tbl = $db->addTable('cc_clinician');
        $tbl->addFieldConditional('active', 1);

        if ($moved_sort > $prev_sort) {
            // moved downward, increase all above
            $tbl->addFieldConditional('sorting', $next_sort, '>=');
            $tbl->addFieldConditional('sorting', $moved_sort, '<');
            $exp = $db->getExpression('sorting + 1');
            $moved_obj->setSorting($next_sort);
        } else {
            // moved upward, decrease all below
            $tbl->addFieldConditional('sorting', $prev_sort, '<=');
            $tbl->addFieldConditional('sorting', $moved_sort, '>');
            $exp = $db->getExpression('sorting - 1');
            $moved_obj->setSorting($prev_sort);
        }

        $tbl->addValue('sorting', $exp);
        $db->update();

        self::saveResource($moved_obj);
    }

}
