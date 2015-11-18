<?php

namespace counseling\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Visit extends \Resource
{
    /**
     * Time the visitor arrived
     * @var \Variable\DateTime
     */
    protected $arrival_time;

    /**
     * Reason for completion of visit (seen by counselor, left early, etc.)
     * These are hard coded.
     * 1 - Seen by counselor
     * 2 - Had to leave
     * 3 - Missing
     * 4 - Made appointment
     * 
     * @var \Variable\Integer
     */
    protected $complete_reason;

    /**
     * User id of admin that marked the visitor complete
     * @var \Variable\Integer
     */
    protected $complete_staff_id;

    /**
     * Time visitor was marked as completed by being seen or leaving.
     * @var \Variable\DateTime
     */
    protected $complete_time;

    /**
     * Array of dispositions associated with completed visit. 
     * @var array
     */
    protected $disposition_array;

    /**
     * If true, the visitor has an emergency that requires attention.
     * @var \Variable\Bool
     */
    protected $has_emergency;

    /**
     * Reason for visit. Id of reason from cc_reason table.
     * @var \Variable\Integer
     */
    protected $reason_id;

    /**
     * Id of visitor from cc_visitor table
     * @var \Variable\Integer
     */
    protected $visitor_id;
    
    protected $table = 'cc_visit';

    public function __construct()
    {
        parent::__construct();
        $this->arrival_time = new \Variable\DateTime(null, 'arrival_time');
        $this->complete_reason = new \Variable\Integer(0, 'complete_reason');
        $this->complete_staff_id = new \Variable\Integer(0, 'complete_staff_id');
        $this->complete_time = new \Variable\DateTime(0, 'complete_time');
        $this->disposition_array = new \Variable\Arr(null, 'disposition_array');
        $this->disposition_array->allowNull(true);
        $this->has_emergency = new \Variable\Bool(null, 'has_emergency');
        $this->reason_id = new \Variable\Integer(null, 'reason_id');
        $this->visitor_id = new \Variable\Integer(null, 'visitor_id');
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

    public function getDispostionArray()
    {
        return $this->disposition_array->get();
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

    public function setDispostionArray($var)
    {
        $this->disposition_array->set($var);
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
}
