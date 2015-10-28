<?php

namespace counseling\Resource;

/**
 * This is the result of a completed meeting.
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Disposition extends \Resource
{
    protected $label;

    protected $table = 'cc_disposition';
    
    public function __construct()
    {
        parent::__construct();
        $this->label = new \Variable\String(null, 'label');
    }

}
