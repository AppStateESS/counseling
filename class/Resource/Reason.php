<?php

namespace counseling\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Reason extends \phpws2\Resource
{
    /**
     * One or two word description of reason.
     *
     * @var \phpws2\Variable\StringVar
     */
    protected $title;

    /**
     * Longed description of reason.
     *
     * @var \phpws2\Variable\StringVar
     */
    protected $description;

    /**
     * What the visitor should do (sit down, see admin, etc.)
     * when done signing in.
     *
     * @var \phpws2\Variable\IntegerVar
     */
    protected $instruction;

    /**
     * If reason is selected, ask user if there is an emergency.
     *
     * @var \phpws2\Variable\Bool
     */
    protected $show_emergency;

    /**
     * Category to list visitor under on admin menu
     * 0 - other
     * 1 - walk-in
     * 2 - individual appointment
     * 3 - emergency
     * 4 - group appointment.
     *
     * @var \phpws2\Variable\IntegerVar
     */
    protected $category;

    /**
     * If true, ask the visitor for their phone number.
     *
     * @var \phpws2\Variable\Bool
     */
    protected $ask_for_phone;

    /**
     * @var \phpws2\Variable\Bool
     */
    protected $active;

    /**
     * Color of reason highlight.
     *
     * @var \phpws2\Variable\StringVar
     */
    protected $color;

    /**
     * Order listed in check in dialog.
     *
     * @var \phpws2\Variable\IntegerVar
     */
    protected $sorting;
    protected $table = 'cc_reason';

    public function __construct()
    {
        parent::__construct();
        $this->title = new \phpws2\Variable\StringVar(null, 'title');
        $this->title->setLimit(100);
        $this->description = new \phpws2\Variable\StringVar(null, 'description');
        $this->description->setLimit(100);
        $this->instruction = new \phpws2\Variable\IntegerVar(null, 'instruction');
        $this->instruction->setRange(0, 100);
        $this->show_emergency = new \phpws2\Variable\BooleanVar(false, 'show_emergency');
        $this->category = new \phpws2\Variable\IntegerVar(0, 'category');
        $this->category->setRange(0, 10);
        $this->color = new \phpws2\Variable\StringVar('default', 'color');
        $this->color->setLimit(20);
        $this->ask_for_phone = new \phpws2\Variable\BooleanVar(false, 'ask_for_phone');
        $this->sorting = new \phpws2\Variable\IntegerVar(1, 'sorting');
        $this->active = new \phpws2\Variable\BooleanVar(true, 'active');
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

    public function getColor()
    {
        return $this->color->get();
    }

    public function getActive()
    {
        return $this->active->get();
    }

    public function getSorting()
    {
        return $this->sorting->get();
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

    public function setActive($var)
    {
        $this->active->set($var);
    }

    public function setSorting($var)
    {
        $this->sorting->set($var);
    }

    public function setColor($var)
    {
        $this->color->set($var);
    }
}
