<?php

namespace counseling\Factory;

use counseling\Resource\Visit as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Visit extends Base
{

    /**
     * @return array
     */
    public static function getCurrentVisits($get_appointments = true)
    {
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit', 't1');
        $tbl->addOrderBy('arrival_time', 'asc');
        $subselect = new \phpws2\Database\SubSelect(self::getVisitCountDB($tbl), 'total_visits');
        $tbl->addField($subselect);
        $tbl->forceSplat();
        $tbl->addFieldConditional('complete_reason', 0);
        $tbl2 = $db->addTable('cc_reason');
        $tbl2->addField('title', 'reason_title');
        $tbl2->addField('color');
        $tbl->addFieldConditional('reason_id', $tbl2->getField('id'));
        if (!$get_appointments) {
            $c1 = $db->createConditional($tbl->getField('has_emergency'), 1);
            $c2 = $db->createConditional($tbl->getField('category'), CC_CATEGORY_APPOINTMENT, '!=');
            $c3 = $db->createConditional($tbl->getField('category'), CC_CATEGORY_GROUP, '!=');
            $c4 = $db->createConditional($c2, $c3, 'and');
            $c5 = $db->createConditional($c1, $c4, 'or');
            $db->addConditional($c5);
        }
        $visits = $db->select();
        if (empty($visits)) {
            return;
        }
        $visits = self::addVisitData($visits);

        return $visits;
    }

    public static function getCurrentlySeen()
    {
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit', 't1');
        $tbl->addOrderBy('arrival_time', 'asc');
        $subselect = new \phpws2\Database\SubSelect(self::getVisitCountDB($tbl), 'total_visits');
        $tbl->addField($subselect);
        $tbl->forceSplat();
        $cra = $db->createConditional($tbl->getField('complete_reason'), 1);
        $crb = $db->createConditional($tbl->getField('disposition_id'), 0);
        $cr2 = $db->createConditional($cra, $crb, 'and');
        $db->addConditional($cr2);
        $tbl2 = $db->addTable('cc_reason');
        $tbl2->addField('title', 'reason_title');
        $tbl->addFieldConditional('reason_id', $tbl2->getField('id'));
        $visits = $db->select();
        if (empty($visits)) {
            return;
        }
        $visits = self::addVisitData($visits);

        return $visits;
    }

    public static function getDaysVisits($start_time, $end_time)
    {
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit', 't1');
        $tbl->addOrderBy('arrival_time', 'asc');
        $subselect = new \phpws2\Database\SubSelect(self::getVisitCountDB($tbl), 'total_visits');
        $tbl->addField($subselect);
        $tbl->forceSplat();
        $tbl->addFieldConditional('complete_reason', 0, '!=');
        $tbl->addFieldConditional('complete_time', $start_time, '>=');
        $tbl->addFieldConditional('complete_time', $end_time, '<');
        $tbl2 = $db->addTable('cc_reason');
        $tbl2->addField('title', 'reason_title');
        $tbl->addFieldConditional('reason_id', $tbl2->getField('id'));
        $visits = $db->select();
        if (empty($visits)) {
            return;
        }
        $visits = self::addVisitData($visits);

        return $visits;
    }

    private static function getVisitCountDB(\phpws2\Database\Table $sub)
    {
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addField(new \phpws2\Database\Expression('count(id)'));
        $tbl->addFieldConditional('visitor_id', $sub->getField('visitor_id'));

        return $db;
    }

    private static function addVisitData($visits)
    {
        foreach ($visits as $visit) {
            $visitor_ids[] = $visit['visitor_id'];
        }
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visitor');
        $tbl->addFieldConditional('id', $visitor_ids);
        $visitors = $db->select();

        foreach ($visitors as $visitor) {
            if (empty($visitor['preferred_name']) || $visitor['preferred_name'] === $visitor['first_name']) {
                $visitor['preferred_name'] = null;
            }
            $sorted_visitors[$visitor['id']] = $visitor;
            $sorted_visitors[$visitor['id']]['previously_seen'] = strftime('%b. %e, %Y', $visitor['previously_seen']);
        }
        foreach ($visits as $key => $visit) {
            if (!isset($sorted_visitors[$visit['visitor_id']])) {
                throw new \Exception("Visitor id {$visit['visitor_id']} is in queue but does not exist");
            }
            $visits[$key]['visitor'] = $sorted_visitors[$visit['visitor_id']];
            if ($visit['complete_reason'] > 0) {
                $visits[$key]['clinician'] = self::getClinician($visit['clinician_id']);
                $visits[$key]['wait_time'] = self::timeWaited($visit['arrival_time'], $visit['complete_time']);
                $visits[$key]['complete_reason_title'] = self::getCompleteReason($visit['complete_reason']);
                $visits[$key]['disposition'] = self::getDisposition($visit['disposition_id']);
            } else {
                $visits[$key]['wait_time'] = self::timeWaited($visit['arrival_time']);
            }
        }

        return $visits;
    }

    public static function build($id = 0)
    {
        $visit = new Resource();
        if ($id) {
            $visit->setId($id);
            if (!parent::loadByID($visit)) {
                throw new \Exception('Visit id not found:' . $id);
            }
        }

        return $visit;
    }

    public static function getDisposition($disposition_id)
    {
        if (empty($disposition_id)) {
            return 'No disposition set';
        }
        $disp_list = self::dispositionList();
        if (empty($disp_list)) {
            throw new \Exception('No dispositions');
        }
        if (isset($disp_list[$disposition_id])) {
            return $disp_list[$disposition_id];
        } else {
            return '[Disposition type deleted]';
        }
    }

    public static function getClinician($clinician_id)
    {
        if (empty($clinician_id)) {
            return 'No clinician set';
        }
        $clin_list = self::clinicianList();
        if (empty($clin_list)) {
            throw new \Exception('No clinicians');
        }
        if (isset($clin_list[$clinician_id])) {
            $clinician = $clin_list[$clinician_id];
            $clinician_name = $clinician['first_name'] . ' ' . $clinician['last_name'];
        } else {
            $clinician_name = '[Clinician deleted]';
        }

        return $clinician_name;
    }

    private static function dispositionList()
    {
        static $disp_list = null;
        if (empty($disp_list)) {
            $db = \phpws2\Database::getDB();
            $tbl = $db->addTable('cc_disposition');
            $result = $db->select();
            if (empty($result)) {
                return;
            }
            foreach ($result as $d) {
                $disp_list[$d['id']] = $d['title'];
            }
        }

        return $disp_list;
    }

    private static function clinicianList()
    {
        static $clin_list = null;
        if (empty($clin_list)) {
            $db = \phpws2\Database::getDB();
            $tbl = $db->addTable('cc_clinician');
            $result = $db->select();
            if (empty($result)) {
                return;
            }
            foreach ($result as $d) {
                $clin_list[$d['id']] = $d;
            }
        }

        return $clin_list;
    }

    public static function getCompleteReason($reason)
    {
        switch ($reason) {
            case CC_COMPLETE_SEEN:
                return 'Seen by clinician';

            case CC_COMPLETE_LEFT:
                return 'Had to leave';

            case CC_COMPLETE_MISSING:
                return 'Missing without notice';

            case CC_COMPLETE_APPOINTMENT:
                return 'Made appointment for later';

            case CC_COMPLETE_SENT_BACK:
                return 'Sent back for appointment';

            case CC_COMPLETE_FULL:
                return 'Full, agreed to return';

            case CC_COMPLETE_CANCELED:
                return 'Canceled appointment';

            case CC_COMPLETE_NO_SHOW:
                return 'Did not show';

            case CC_COMPLETE_RESCHEDULED:
                return 'Rescheduled appointment';

            default:
                return 'Unknown reason';
        }
    }

    /**
     * Returns a count of the total completed visits. Included emergency and non.
     *
     * @return string
     */
    public static function getCurrentVisitCount()
    {
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addField(new \phpws2\Database\Expression('count(id)', 'count'));
        $tbl->addFieldConditional('complete_time', 0);
        $visits = $db->selectColumn();

        return $visits;
    }

    public static function timeWaited($timestamp, $final = null)
    {
        if (empty($final)) {
            $final = time();
        }
        $timestamp = intval($timestamp);
        $rel = $final - $timestamp;

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
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addFieldConditional('id', $visit_id);
        $db->delete();
    }

    public static function reset($visit_id)
    {
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addFieldConditional('id', $visit_id);
        $tbl->addValue('complete_reason', 0);
        $tbl->addValue('clinician_id', 0);
        $tbl->addValue('arrival_time', time());
        $tbl->addValue('complete_time', 0);
        $db->update();
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
        $db = \phpws2\Database::getDB();
        $visit = $db->addTable('cc_visit');
        $visit->addFieldConditional('complete_reason', 0);
        $visitor = $db->addTable('cc_visitor', null, false);
        $visitor->addFieldConditional('banner_id', $banner_id);
        $db->joinResources($visitor, $visit, $db->createConditional($visit->getField('visitor_id'), $visitor->getField('id')));

        return $db->selectOneRow();
    }

}
