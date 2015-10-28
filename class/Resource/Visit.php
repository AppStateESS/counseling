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
     * @var \Variable\Integer
     */
    protected $complete_reason;

    /**
     * User id of admin that marked the student complete
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
        $this->complete_reason = new \Variable\Integer(null, 'complete_reason');
        $this->complete_staff_id = new \Variable\Integer(null, 'complete_staff_id');
        $this->complete_time = new \Variable\Integer(null, 'complete_time');
        $this->disposition_array = new \Variable\Arr(null, 'disposition_array');
        $this->disposition_array->setIsTableColumn(false);
        $this->has_emergency = new \Variable\Bool(null, 'has_emergency');
        $this->reason_id = new \Variable\Integer(null, 'reason_id');
        $this->visitor_id = new \Variable\Integer(null, 'visitor_id');
    }

}
