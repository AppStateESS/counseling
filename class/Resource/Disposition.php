<?php

namespace counseling\Resource;

/**
 * This is the result of a completed meeting.
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Disposition extends \Resource
{
    protected $title;

    protected $color;

    protected $icon;

    protected $active;

    protected $sorting;

    protected $table = 'cc_disposition';

    public function __construct()
    {
        parent::__construct();
        $this->title = new \phpws2\Variable\CanopyString(null, 'title');
        $this->title->setLimit(100);
        $this->color = new \phpws2\Variable\Attribute(null, 'color');
        $this->color->setLimit(30);
        $this->icon = new \phpws2\Variable\CanopyString(null, 'icon');
        $this->icon->setLimit(30);
        $this->sorting = new \phpws2\Variable\Integer(1, 'sorting');
        $this->active = new \phpws2\Variable\Boolean(1, 'active');
    }

    public function setTitle($title)
    {
        $this->title->set($title);
    }

    public function getTitle($title)
    {
        return $this->title->get();
    }

    public function setColor($color)
    {
        $this->color->set($color);
    }

    public function getColor()
    {
        return $this->color->get();
    }

    public function setIcon($icon)
    {
        $this->icon->set($icon);
    }

    public function getIcon()
    {
        return $this->icon->get();
    }

    public function setActive($active)
    {
        $this->active->set($active);
    }

    public function getActive()
    {
        return $this->active->get();
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
