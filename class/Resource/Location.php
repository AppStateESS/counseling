<?php

/*
 * Copyright (C) 2017 Matthew McNaney <mcnaneym@appstate.edu>.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */

namespace counseling\Resource;

/**
 * Description of Location
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Location extends \phpws2\Resource
{

    protected $table = 'cc_location';
    protected $title;
    protected $active;

    public function __construct()
    {
        parent::__construct();
        $this->title = new \phpws2\Variable\TextOnly(null, 'title');
        $this->active = new \phpws2\Variable\BooleanVar(true, 'active');
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
