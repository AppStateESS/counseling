<?php

namespace counseling\Factory;

use counseling\Resource\Visit as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Visit extends Base
{

    public static function getCurrentVisits($emergency = false)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visit', 't1');
        $tbl->addOrderBy('arrival_time', 'desc');
        $subselect = new \Database\SubSelect(self::getVisitCountDB($tbl), 'total_visits');
        $tbl->addField($subselect);
        $tbl->forceSplat();
        $tbl->addFieldConditional('complete_time', 0);
        $tbl->addFieldConditional('has_emergency', $emergency ? '1' : '0');
        
        $visits = $db->select();
        if (empty($visits)) {
            return null;
        }
        $visits = self::addVisitData($visits);
        return $visits;
    }
    
    private static function getVisitCountDB(\Database\Table $sub)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addField(new \Database\Expression('count(id)'));
        $tbl->addFieldConditional('visitor_id', $sub->getField('visitor_id'));
        return $db;
    }

    private static function addVisitData($visits)
    {
        foreach ($visits as $visit) {
            $visitor_ids[] = $visit['visitor_id'];
        }
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visitor');
        $tbl->addFieldConditional('id', $visitor_ids);
        $visitors = $db->select();

        foreach ($visitors as $visitor) {
            $sorted_visitors[$visitor['id']] = $visitor;
        }

        foreach ($visits as $key => $visit) {
            $visits[$key]['visitor'] = $sorted_visitors[$visit['visitor_id']];
            $visits[$key]['wait_time'] = self::timeWaited($visit['arrival_time']);
        }
        return $visits;
    }

    public static function timeWaited($timestamp)
    {
        $timestamp = intval($timestamp);
        $rel = time() - $timestamp;
        return (int)floor($rel / 60);
    }

}
