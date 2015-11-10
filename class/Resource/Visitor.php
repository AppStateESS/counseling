<?php

namespace counseling\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Visitor extends \Resource
{
    /**
     * Banner Id
     * @var \Variable\Integer
     */
    protected $banner_id;

    /**
     * @var \Variable\String
     */
    protected $first_name;

    /**
     * Timestamp of first visit
     * This variable could be derived from the visit records.
     * Adding here for quick access
     * @var \Variable\DateTime
     */
    protected $first_visit;

    /**
     * Tracks if visitor was seen regardless of visits.
     * @var \Variable\Bool 
     */
    protected $has_been_seen;

    /**
     * @var \Variable\String
     */
    protected $last_name;

    /**
     * Timestamp of last visit
     * See first_visit notes on
     * @var \Variable\DateTime
     */
    protected $last_visit;

    /**
     * Visitor phone number
     * @var \Variable\PhoneNumber
     */
    protected $phone_number;

    /**
     * Number of visits to office
     * @var \Variable\Integer
     */
    protected $visit_count;
    
    /**
     * @var \Variable\Email
     */
    protected $email;
    
    /**
     * @var \Variable\Bool
     */
    protected $intake_complete;

    /**
     * @var \Variable\Bool
     */
    protected $previously_seen;
    
    protected $table = 'cc_visitor';

    public function __construct()
    {
        parent::__construct();
        $this->banner_id = new \Variable\Integer(null, 'banner_id');
        $this->first_name = new \Variable\String(null, 'first_name');
        $this->first_name->setLimit(50);
        $this->first_visit = new \Variable\DateTime(0, 'first_visit');
        $this->first_visit->setFormat('%Y/%m/%d %l:%M%P');
        $this->has_been_seen = new \Variable\Bool(false, 'has_been_seen');
        $this->last_name = new \Variable\String(null, 'last_name');
        $this->last_name->setLimit(50);
        $this->last_visit = new \Variable\DateTime(null, 'last_visit');
        $this->last_visit->setFormat('%Y/%m/%d %l:%M%P');
        $this->phone_number = new \Variable\PhoneNumber(null, 'phone_number');
        $this->phone_number->formatNumber(true);
        $this->visit_count = new \Variable\Integer(null, 'visit_count');
        $this->email = new \Variable\Email(null, 'email');
        $this->email->setLimit(100);
        $this->intake_complete = new \Variable\Bool(false, 'intake_complete');
        $this->previously_seen = new \Variable\Bool(false, 'previously_seen');
    }

    public function setBannerId($var)
    {
        $this->banner_id->set($var);
    }

    public function setFirstName($var)
    {
        $this->first_name->set($var);
    }

    public function setFirstVisit($var)
    {
        $this->first_visit->set($var);
    }

    public function stampFirstVisit()
    {
        $this->first_visit->stamp();
    }

    public function setHasBeenSeen($var)
    {
        $this->has_been_seen->set($var);
    }

    public function setLastName($var)
    {
        $this->last_name->set($var);
    }

    public function setLastVisit($last_visit)
    {
        $this->last_visit->set($last_visit);
    }

    public function stampLastVisit()
    {
        $this->last_visit->stamp();
    }

    public function setPhoneNumber($var)
    {
        $this->phone_number->set($var);
    }

    public function setVisitCount($var)
    {
        $this->visit_count->set($var);
    }

    public function setEmail($var)
    {
        $this->email->set($var);
    }

    public function setIntakeComplete($var)
    {
        $this->intake_complete->set($var);
    }
    
    public function getBannerId()
    {
        return $this->banner_id->get();
    }

    public function getEmail()
    {
        return $this->email->get();
    }

    public function getFirstName()
    {
        return $this->first_name->get();
    }

    public function getFirstVisit()
    {
        return $this->first_visit->get();
    }

    public function getHasBeenSeen()
    {
        return $this->has_been_seen->get();
    }
    
    public function getIntakeComplete()
    {
        return $this->intake_complete->get();
    }

    public function getLastName()
    {
        return $this->last_name->get();
    }

    public function getLastVisit()
    {
        return $this->last_visit->get();
    }

    public function getPhoneNumber()
    {
        return $this->phone_number->get();
    }

    public function getVisitCount()
    {
        return $this->visit_count->get();
    }

}
