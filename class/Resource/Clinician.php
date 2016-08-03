<?php

namespace counseling\Resource;

/**
 * The counselors seeing people.
 * Initially was going to pair to user accounts, but no longer required.
 * 
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Clinician extends \Resource
{
    /**
     * @var \Variable\String
     */
    protected $first_name;

    /**
     * @var \Variable\String
     */
    protected $last_name;

    /**
     * @var \Variable\Integer
     */
    protected $visitors_seen;
    protected $active;
    protected $sorting;
    protected $table = 'cc_clinician';

    public function __construct()
    {
        parent::__construct();
        $this->first_name = new \Variable\String(null, 'first_name');
        $this->first_name->setLimit(50);
        $this->last_name = new \Variable\String(null, 'last_name');
        $this->last_name->setLimit(50);
        $this->active = new \Variable\Bool(true, 'active');
        $this->visitors_seen = new \Variable\Integer(0, 'visitors_seen');
        $this->sorting = new \Variable\Integer(1, 'sorting');
    }

    public function setLastName($var)
    {
        $this->last_name->set($var);
    }

    public function getLastName()
    {
        return $this->last_name->get();
    }

    public function setFirstName($var)
    {
        $this->first_name->set($var);
    }

    public function getFirstName()
    {
        return $this->first_name->get();
    }

    public function setActive($var)
    {
        $this->active->set($var);
    }

    public function getActive()
    {
        return $this->active->get();
    }

    public function setVisitorsSeen($var)
    {
        $this->visitors_seen->set($var);
    }

    public function getVisitorsSeen()
    {
        $this->visitors_seen->get();
    }

    public function incrementVisitorsSeen()
    {
        $this->visitors_seen->increase();
    }

    public function setSorting($var)
    {
        $this->sorting->set($var);
    }

    public function getSorting()
    {
        return $this->sorting->get();
    }
}
