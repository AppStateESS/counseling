<?php

namespace counseling\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Visitor extends \phpws2\Resource
{
    /**
     * Banner Id.
     *
     * @var \Variable\IntegerVar
     */
    protected $banner_id;

    /**
     * @var \Variable\StringVar
     */
    protected $first_name;

    /**
     * @var \Variable\StringVar
     */
    protected $preferred_name;

    /**
     * Timestamp of first visit
     * This variable could be derived from the visit records.
     * Adding here for quick access.
     *
     * @var \Variable\DateTime
     */
    protected $first_visit;

    /**
     * Tracks if visitor was seen regardless of visits.
     *
     * @var \Variable\Bool
     */
    protected $seen_last_visit;

    /**
     * @var \Variable\StringVar
     */
    protected $last_name;

    /**
     * Timestamp of last visit
     * See first_visit notes on.
     *
     * @var \Variable\DateTime
     */
    protected $last_visit;

    /**
     * Visitor phone number.
     *
     * @var \Variable\PhoneNumber
     */
    protected $phone_number;

    /**
     * @var \Variable\Email
     */
    protected $email;

    /**
     * @var \Variable\Bool
     */
    protected $intake_complete;

    /**
     * @var \Variable\DateTime
     */
    protected $previously_seen;

    protected $table = 'cc_visitor';

    public function __construct()
    {
        parent::__construct();
        $this->banner_id = new \phpws2\Variable\IntegerVar(null, 'banner_id');
        $this->first_name = new \phpws2\Variable\StringVar(null, 'first_name');
        $this->first_name->setLimit(50);
        $this->preferred_name = new \phpws2\Variable\StringVar(null, 'preferred_name');
        $this->preferred_name->setLimit(50);
        $this->first_visit = new \phpws2\Variable\DateTime(0, 'first_visit');
        $this->first_visit->setFormat('%Y/%m/%d %l:%M%P');
        $this->seen_last_visit = new \phpws2\Variable\BooleanVar(false, 'seen_last_visit');
        $this->last_name = new \phpws2\Variable\StringVar(null, 'last_name');
        $this->last_name->setLimit(50);
        $this->last_visit = new \phpws2\Variable\DateTime(null, 'last_visit');
        $this->last_visit->setFormat('%Y/%m/%d %l:%M%P');
        $this->phone_number = new \phpws2\Variable\PhoneNumber(null, 'phone_number');
        $this->phone_number->formatNumber(true);
        $this->email = new \phpws2\Variable\Email(null, 'email');
        $this->email->setLimit(100);
        $this->intake_complete = new \phpws2\Variable\BooleanVar(false, 'intake_complete');
        $this->previously_seen = new \phpws2\Variable\DateTime(0, 'previously_seen');
    }

    public function setBannerId($var)
    {
        $this->banner_id->set($var);
    }

    public function setFirstName($var)
    {
        $this->first_name->set($var);
    }

    public function setPreferredName($var)
    {
        $this->preferred_name->set($var);
    }

    public function setFirstVisit($var)
    {
        $this->first_visit->set($var);
    }

    public function stampFirstVisit()
    {
        $this->first_visit->stamp();
    }

    public function setSeenLastVisit($var)
    {
        $this->seen_last_visit->set($var);
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

    public function setPreviouslySeen($var)
    {
        $this->previously_seen->set($var);
    }

    public function stampPreviouslySeen()
    {
        $this->previously_seen->stamp();
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

    public function getPreferredName()
    {
        return $this->preferred_name->get();
    }

    public function getFirstVisit()
    {
        return $this->first_visit->get();
    }

    public function getSeenLastVisit()
    {
        return $this->seen_last_visit->get();
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

    public function getPreviouslySeen()
    {
        return $this->previously_seen->get();
    }
}
