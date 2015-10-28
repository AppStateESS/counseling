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
    protected $label;
    
    /**
     * Longed description of reason
     * @var \Variable\String
     */
    protected $summary;
    
    /**
     * What the visitor should do (sit down, see admin, etc.)
     * when done signing in.
     * @var \Variable\String
     */
    protected $instruction;
    
    /**
     * If reason is selected, flag visit as an emergency
     * @var \Variable\Bool
     */
    protected $flag_emergency;
    
    protected $icon;
    
    protected $admin_menu_show;
    
    protected $other;
    
    /**
     * Whether they should be seen on wait list.
     * @var type
     */
    protected $wait_listed;
    
    protected $table = 'cc_reason';
    
    public function __construct()
    {
        parent::__construct();
        $this->label = new \Variable\String(null, 'label');
        $this->summary = new \Variable\String(null, 'summary');
        $this->instruction = new \Variable\String(null, 'instruction');
        $this->flag_emergency = new \Variable\Bool(null, 'flag_emergency');
        $this->icon = new \Variable\String(null, 'icon');
        $this->admin_menu_show = new \Variable\Bool(null, 'admin_menu_show');
        $this->wait_listed = new \Variable\Bool(null, 'wait_listed');
    }
    
}
