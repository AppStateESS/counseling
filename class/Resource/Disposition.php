<?php

namespace counseling\Resource;

/**
 * This is the result of a completed meeting.
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Disposition extends \Resource
{
    protected $title;

    protected $active;
    
    protected $table = 'cc_disposition';
    
    public function __construct()
    {
        parent::__construct();
        $this->title = new \Variable\String(null, 'title');
        $this->title->setLimit(100);
        $this->active = new \Variable\Bool(1, 'active');
    }
    
    public function setTitle($title)
    {
        $this->title->set($title);
    }
    
    public function getTitle($title)
    {
        return $this->title->get();
    }
    
    public function setActive($active)
    {
        $this->active->set($active);
    }
    
    public function getActive()
    {
        return $this->active->get();
    }

}
