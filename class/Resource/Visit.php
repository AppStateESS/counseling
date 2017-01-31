<?php

namespace counseling\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Visit extends \Resource
{
    /**
     * Time the visitor arrived.
     *
     * @var \phpws2\Variable\DateTime
     */
    protected $arrival_time;

    /**
     * Reason for completion of visit (seen by counselor, left early, etc.)
     * These are hard coded.
     * 1 - Seen by counselor
     * 2 - Had to leave
     * 3 - Missing
     * 4 - Made appointment.
     * 
     * @var \phpws2\Variable\Integer
     */
    protected $complete_reason;

    /**
     * User id of admin that marked the visitor complete.
     *
     * @var \phpws2\Variable\Integer
     */
    protected $complete_staff_id;

    /**
     * Time visitor was marked as completed by being seen or leaving.
     *
     * @var \phpws2\Variable\DateTime
     */
    protected $complete_time;

    /**
     * Id of disposition.
     *
     * @var array
     */
    protected $disposition_id;

    /**
     * If true, the visitor has an emergency that requires attention.
     *
     * @var \phpws2\Variable\Bool
     */
    protected $has_emergency;

    /**
     * Reason for visit. Id of reason from cc_reason table.
     *
     * @var \phpws2\Variable\Integer
     */
    protected $reason_id;

    /**
     * Id of visitor from cc_visitor table.
     *
     * @var \phpws2\Variable\Integer
     */
    protected $visitor_id;

    /**
     * Id of clinician from cc_clinician table.
     *
     * @var \phpws2\Variable\Integer
     */
    protected $clinician_id;

    /**
     * Indicates if student is walk-in or has an appointment.
     * 0 = other
     * 1 = walk in
     * 2 = individual appointment
     * 3 = emergency
     * 4 = group appointment.
     *
     * @var \phpws2\Variable\Integer
     */
    protected $category;

    protected $table = 'cc_visit';

    public function __construct()
    {
        parent::__construct();
        $this->arrival_time = new \phpws2\Variable\DateTime(null, 'arrival_time');
        $this->complete_reason = new \phpws2\Variable\Integer(0, 'complete_reason');
        $this->complete_staff_id = new \phpws2\Variable\Integer(0, 'complete_staff_id');
        $this->complete_time = new \phpws2\Variable\DateTime(0, 'complete_time');
        $this->disposition_id = new \phpws2\Variable\Integer(0, 'disposition_id');
        $this->has_emergency = new \phpws2\Variable\Boolean(null, 'has_emergency');
        $this->reason_id = new \phpws2\Variable\Integer(null, 'reason_id');
        $this->visitor_id = new \phpws2\Variable\Integer(null, 'visitor_id');
        $this->clinician_id = new \phpws2\Variable\Integer(null, 'clinician_id');
        $this->category = new \phpws2\Variable\Integer(null, 'category');
    }

    public function getArrivalTime()
    {
        return $this->arrival_time->get();
    }

    public function getCompleteReason()
    {
        return $this->complete_reason->get();
    }

    public function getCompleteStaffId()
    {
        return $this->complete_staff_id->get();
    }

    public function getCompleteTime()
    {
        return $this->complete_time->get();
    }

    public function getDispositionId()
    {
        return $this->disposition_id->get();
    }

    public function getHasEmergency()
    {
        return $this->has_emergency->get();
    }

    public function getReasonId()
    {
        return $this->reason_id->get();
    }

    public function getVisitorId()
    {
        return $this->visitor_id->get();
    }

    public function setArrivalTime($var)
    {
        $this->arrival_time->set($var);
    }

    public function setCompleteReason($var)
    {
        $this->complete_reason->set($var);
    }

    public function setCompleteStaffId($var)
    {
        $this->complete_staff_id->set($var);
    }

    public function setCompleteTime($var)
    {
        $this->complete_time->set($var);
    }

    public function setDispositionId($var)
    {
        $this->disposition_id->set($var);
    }

    public function setHasEmergency($var)
    {
        $this->has_emergency->set($var);
    }

    public function setFullName($var)
    {
        $this->full_name->set($var);
    }

    public function setReasonId($var)
    {
        $this->reason_id->set($var);
    }

    public function setVisitorId($var)
    {
        $this->visitor_id->set($var);
    }

    public function stampArrivalTime()
    {
        $this->arrival_time->stamp();
    }

    public function stampCompleteTime()
    {
        $this->complete_time->stamp();
    }

    public function setClinicianId($var)
    {
        $this->clinician_id->set($var);
    }

    public function getClinicianId()
    {
        return $this->clinician_id->get();
    }

    public function setCategory($wait)
    {
        $this->category->set($wait);
    }

    public function getCategory()
    {
        return $this->category->get();
    }
}
