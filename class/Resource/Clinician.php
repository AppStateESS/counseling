<?php

namespace counseling\Resource;

/**
 * The counselors seeing people. This is a superflous class as the moment.
 * You could just use user admin accounts. That said, the clinician role
 * and functionality might require it. It is best to have at the start
 * rather than force it in later.
 * 
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Clinician extends \Resource
{
    protected $user_id;
    protected $name;
    
    protected $table = 'cc_clinician';

    public function __construct()
    {
        parent::__construct();
        $this->user_id = new \Variable\Integer(null, 'user_id');
        $this->name = new \Variable\String(null, 'name');
    }

}
