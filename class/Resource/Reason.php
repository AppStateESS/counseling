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
     * If reason is selected, flag visit as an emergency
     * @var \Variable\Bool
     */
    protected $flag_emergency;

    /**
     * FontAwesome icon name. Shown is admin_menu_show is true.
     * @var \Variable\String
     */
    protected $icon;

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
     * Order listed in check in dialog
     * @var \Variable\Integer
     */
    protected $ordering;
    protected $table = 'cc_reason';

    public function __construct()
    {
        parent::__construct();
        $this->title = new \Variable\String(null, 'label');
        $this->title->setLimit(100);
        $this->description = new \Variable\String(null, 'summary');
        $this->description->setLimit(100);
        $this->instruction = new \Variable\String(null, 'instruction');
        $this->instruction->setLimit(100);
        $this->flag_emergency = new \Variable\Bool(null, 'flag_emergency');
        $this->icon = new \Variable\String(null, 'icon');
        $this->icon->setLimit(20);
        $this->admin_menu_show = new \Variable\Bool(null, 'admin_menu_show');
        $this->wait_listed = new \Variable\Bool(null, 'wait_listed');
        $this->ordering = new \Variable\Integer(1, 'order');
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

    public function getFlagEmergency()
    {
        return $this->flag_emergency->get();
    }

    public function getIcon()
    {
        return $this->icon->get();
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

    public function setFlagEmergency($var)
    {
        $this->flag_emergency->set($var);
    }

    public function setIcon($var)
    {
        $this->icon->set($var);
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
