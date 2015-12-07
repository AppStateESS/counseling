<?php

namespace counseling\Factory;

use counseling\Resource\Visitor as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Visitor extends Base
{

    public static function getByBannerId($banner_id)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visitor');
        $tbl->addFieldConditional('banner_id', $banner_id);
        $visitorArray = $db->selectOneRow();
        if (empty($visitorArray)) {
            return null;
        }
        $visitor = new Resource;
        $visitor->setVars($visitorArray);
        return $visitor;
    }

    /**
     * 
     * @param integer $id
     * @return \counseling\Resource\Visitor
     */
    public static function build($id = 0)
    {
        $visitor = new Resource;
        if ($id) {
            $visitor->setId($id);
            if (!parent::loadByID($visitor)) {
                throw new \Exception('Visitor id not found:' . $id);
            }
        }
        return $visitor;
    }

    public static function createFromBanner($banner_id)
    {
        if (COUNSELING_FAKE_VISITOR) {
            $vars = Banner::pullByFakeBannerId($banner_id);
        } else {
            $vars = Banner::pullByBannerId($banner_id);
        }

        if (empty($vars)) {
            return null;
        }

        $visitor = new Resource;
        $visitor->setBannerId($banner_id);
        $visitor->setFirstName($vars['firstName']);
        $visitor->stampFirstVisit();
        $visitor->setSeenLastVisit(false);
        $visitor->setLastname($vars['lastName']);
        $visitor->stampLastVisit();
        $visitor->setPhoneNumber($vars['phoneNumber']);
        $visitor->setEmail($vars['emailAddress']);

        self::saveResource($visitor);

        return $visitor;
    }

    public static function intakeComplete($id)
    {
        $visitor = new Resource;
        self::loadByID($visitor, $id);
        $visitor->setIntakeComplete(true);
        self::saveResource($visitor);
    }

    public static function stampAsNotSeen($visitor_id)
    {
        $visitor = self::build($visitor_id);
        $visitor->setSeenLastVisit(false);
        $visitor->stampLastVisit();
        self::saveResource($visitor);
    }

    public static function stampAsSeen($visitor_id)
    {
        $visitor = self::build($visitor_id);
        $visitor->setSeenLastVisit(true);
        $visitor->stampLastVisit();
        $visitor->stampPreviouslySeen();
        self::saveResource($visitor);
    }

}
