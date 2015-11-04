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
     * @var \Variable\Integer
     */
    protected $first_visit;

    /**
     * Tracks if student was seen regardless of visits.
     * @var type 
     */
    protected $has_been_seen;

    /**
     * @var \Variable\String
     */
    protected $last_name;

    /**
     * Timestamp of last visit
     * See first_visit notes on
     * @var \Variable\Integer
     */
    protected $last_visit;

    /**
     * Visitor phone number
     * @var \Variable\PhoneNumber
     */
    protected $phone_number;

    /**
     * Id of user from users table
     * @var \Variable\Integer
     */
    protected $user_id;

    /**
     * Number of visits to office
     * @var \Variable\Integer
     */
    protected $visit_count;
    
    protected $table = 'cc_visitor';

    public function __construct()
    {
        parent::__construct();
        $this->banner_id = new \Variable\Integer(null, 'banner_id');
        $this->first_name = new \Variable\String(null, 'first_name');
        $this->first_name->setLimit(50);
        $this->first_visit = new \Variable\Bool(null, 'first_visit');
        $this->has_been_seen = new \Variable\Bool(null, 'has_been_seen');
        $this->last_name = new \Variable\String(null, 'last_name');
        $this->last_name->setLimit(50);
        $this->last_visit = new \Variable\DateTime(null, 'last_visit');
        $this->phone_number = new \Variable\PhoneNumber(null, 'phone_number');
        $this->user_id = new \Variable\Integer(null, 'user_id');
        $this->visit_count = new \Variable\Integer(null, 'visit_count');
        $this->email = new \Variable\Email(null, 'email');
        $this->email->setLimit(100);
    }

}
