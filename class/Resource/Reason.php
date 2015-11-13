<?php

namespace counseling\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Reason extends \Resource
{
    /**
     * One or two word description of reason
     * @var \Variable\String
     */
    protected $title;

    /**
     * Longed description of reason
     * @var \Variable\String
     */
    protected $description;

    /**
     * What the visitor should do (sit down, see admin, etc.)
     * when done signing in.
     * @var \Variable\Integer
     */
    protected $instruction;

    /**
     * If reason is selected, ask user if there is an emergency
     * @var \Variable\Bool
     */
    protected $show_emergency;

    /**
     * Category to list visitor under on admin menu
     * @var \Variable\Integer
     */
    protected $category;

    /**
     * If true, show tally of waiting with that reason
     * @var \Variable\Bool
     */
    protected $admin_menu_show;

    /**
     * Whether they should be seen on wait list.
     * @var \Variable\Bool
     * 
     */
    protected $wait_listed;
    
    /**
     * If true, ask the visitor for their phone number.
     * @var \Variable\Bool
     */
    protected $ask_for_phone;

    /**
     * Order listed in check in dialog
     * @var \Variable\Integer
     */
    protected $ordering;
    protected $table = 'cc_reason';

    public function __construct()
    {
        parent::__construct();
        $this->title = new \Variable\String(null, 'title');
        $this->title->setLimit(100);
        $this->description = new \Variable\String(null, 'description');
        $this->description->setLimit(100);
        $this->instruction = new \Variable\Integer(null, 'instruction');
        $this->instruction->setRange(0,100);
        $this->show_emergency = new \Variable\Bool(false, 'show_emergency');
        $this->category = new \Variable\Integer(0, 'category');
        $this->category->setRange(0, 10);
        $this->admin_menu_show = new \Variable\Bool(false, 'admin_menu_show');
        $this->wait_listed = new \Variable\Bool(false, 'wait_listed');
        $this->ask_for_phone = new \Variable\Bool(false, 'ask_for_phone');
        $this->ordering = new \Variable\Integer(1, 'ordering');
    }

    public function getAskForPhone()
    {
        return $this->ask_for_phone->get();
    }
    
    public function getTitle()
    {
        return $this->title->get();
    }

    public function getDescription()
    {
        return $this->description->get();
    }

    public function getInstruction()
    {
        return $this->instruction->get();
    }

    public function getShowEmergency()
    {
        return $this->show_emergency->get();
    }

    public function getCategory()
    {
        return $this->category->get();
    }

    public function getAdminMenuShow()
    {
        return $this->admin_menu_show->get();
    }

    public function getWaitListed()
    {
        return $this->wait_listed->get();
    }

    public function getOrdering()
    {
        return $this->ordering->get();
    }

    public function setAskForPhone($var)
    {
        return $this->ask_for_phone->set($var);
    }
    
    public function setTitle($var)
    {
        $this->title->set($var);
    }

    public function setDescription($var)
    {
        $this->description->set($var);
    }

    public function setInstruction($var)
    {
        $this->instruction->set($var);
    }

    public function setShowEmergency($var)
    {
        $this->show_emergency->set($var);
    }

    public function setCategory($var)
    {
        $this->category->set($var);
    }

    public function setAdminMenuShow($var)
    {
        $this->admin_menu_show->set($var);
    }

    public function setWaitListed($var)
    {
        $this->wait_listed->set($var);
    }

    public function setOrdering($var)
    {
        $this->ordering->set($var);
    }

}
