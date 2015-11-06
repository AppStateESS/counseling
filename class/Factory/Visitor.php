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
        $visitor->setHasBeenSeen(false);
        $visitor->setLastname($vars['lastName']);
        $visitor->stampLastVisit();
        $visitor->setPhoneNumber($vars['phoneNumber']);
        $visitor->setVisitCount(1);
        $visitor->setEmail($vars['emailAddress']);

        self::saveResource($visitor);
        
        return $visitor;
    }
    
}
