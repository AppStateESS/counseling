<?php

namespace counseling\Factory;

use counseling\Resource\Visit as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Visit extends Base
{

    /**
     * @return array
     */
    public static function getCurrentVisits()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visit', 't1');
        $tbl->addOrderBy('arrival_time', 'asc');
        $subselect = new \Database\SubSelect(self::getVisitCountDB($tbl), 'total_visits');
        $tbl->addField($subselect);
        $tbl->forceSplat();
        $tbl->addFieldConditional('complete_reason', 0);
        //$tbl->addFieldConditional('clinician_id', 0);
        $tbl2 = $db->addTable('cc_reason');
        $tbl2->addField('title', 'reason_title');
        $tbl2->addField('category');
        $tbl->addFieldConditional('reason_id', $tbl2->getField('id'));
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
            $sorted_visitors[$visitor['id']]['previously_seen'] = strftime('%b. %e, %Y', $visitor['previously_seen']);
        }

        foreach ($visits as $key => $visit) {
            $visits[$key]['visitor'] = $sorted_visitors[$visit['visitor_id']];
            $visits[$key]['wait_time'] = self::timeWaited($visit['arrival_time']);
        }
        return $visits;
    }

    public static function build($id = 0)
    {
        $visit = new Resource;
        if ($id) {
            $visit->setId($id);
            if (!parent::loadByID($visit)) {
                 throw new \Exception('Visit id not found:' . $id);
            }
        }
        return $visit;
    }

    /**
     * Returns a count of the total completed visits. Included emergency and non.
     * @return string
     */
    public static function getCurrentVisitCount()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addField(new \Database\Expression('count(id)', 'count'));
        $tbl->addFieldConditional('complete_time', 0);
        $visits = $db->selectColumn();
        return $visits;
    }

    public static function timeWaited($timestamp)
    {
        $timestamp = intval($timestamp);
        $rel = time() - $timestamp;
        return (int) floor($rel / 60);
    }

    public static function setCompleteReason($visit_id, $reason)
    {
        $visit = self::build($visit_id);
        $visit->setCompleteReason($reason);
        $visit->setCompleteStaffId(\Current_User::getId());
        $visit->stampCompleteTime();
        self::saveResource($visit);

        if ($visit->getCompleteReason() == CC_COMPLETE_SEEN) {
            Visitor::stampAsSeen($visit->getVisitorId());
        } else {
            Visitor::stampAsNotSeen($visit->getVisitorId());
        }
    }

    public static function delete($visit_id)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addFieldConditional('id', $visit_id);
        $db->delete();
    }

    public static function attachClinician($visit_id, $clinician_id)
    {
        $visit = self::build($visit_id);
        $visit->setClinicianId($clinician_id);
        $visit->setCompleteReason(CC_COMPLETE_SEEN);
        $visit->stampCompleteTime();

        self::saveResource($visit);

        \counseling\Factory\Visitor::stampAsSeen($visit->getVisitorId());
    }
    
    public static function setDisposition($visit_id, $disposition_id)
    {
        $visit = self::build($visit_id);
        $visit->setDispositionId($disposition_id);
        self::saveResource($visit);
    }
    
    public static function getWaitingByBanner($banner_id)
    {
        $db = \Database::getDB();
        $visit = $db->addTable('cc_visit');
        $visit->addFieldConditional('complete_reason', 0);
        $visitor = $db->addTable('cc_visitor', null, false);
        $visitor->addFieldConditional('banner_id', $banner_id);
        $db->joinResources($visitor, $visit, 
                $db->createConditional($visit->getField('visitor_id'), $visitor->getField('id')));
        return $db->selectOneRow();
    }

}
