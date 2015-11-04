<?php

namespace counseling\Factory;

use counseling\Resource\Reason as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Reason extends Base
{

    public static function listReasons()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_reason');
        $tbl->addOrderBy('ordering');
        $result = $db->select();
        foreach ($result as $key => $value) {
            $result[$key]['instruction_full'] = self::getFullInstruction($value['instruction']);
        }
        return $result;
    }

    public static function getFullInstruction($instruction)
    {
        switch ($instruction) {
            case 1:
                return COUNSELING_SIT_INSTRUCTION;
                break;

            case 2:
                return COUNSELING_FRONT_DESK_INSTRUCTION;
                break;

            default:
                throw new \Exception('Unknown instruction:' . $instruction);
        }
    }

    public static function getInstructionList()
    {
        return array(1 => COUNSELING_SIT_INSTRUCTION, 2 => COUNSELING_FRONT_DESK_INSTRUCTION);
    }

    public static function loadByPost($varname = 'reasonId')
    {
        $reason = new Resource;
        $reason->setId(filter_input(INPUT_POST, $varname, FILTER_SANITIZE_NUMBER_INT));
        self::loadByID($reason);
        return $reason;
    }

    public static function build($id = 0)
    {
        $reason = new Resource;
        if ($id) {
            $reason->setId($id);
            parent::loadByID($reason);
        }
        return $reason;
    }

    public static function post()
    {
        $reason_id = filter_input(INPUT_POST, 'reasonId', FILTER_SANITIZE_NUMBER_INT);
        $reason = self::build($reason_id);
        $reason->setTitle(self::pullPostString('title'));
        $reason->setDescription(self::pullPostString('description'));
        $reason->setInstruction(self::pullPostInteger('instruction'));
        $reason->setShowEmergency(self::pullPostCheck('showEmergency'));
        $reason->setIcon(self::pullPostString('icon'));
        $reason->setAdminMenuShow(self::pullPostCheck('adminMenuShow'));
        $reason->setWaitListed(self::pullPostCheck('waitListed'));
        $reason->setAskForPhone(self::pullPostCheck('askForPhone'));
        $reason->setOrdering(self::getLastOrder() + 1);

        self::saveResource($reason);
    }

    public static function getLastOrder()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_reason', null, false);
        $col = $tbl->getField('ordering');
        $exp = new \Database\Expression("max($col)", 'max');
        $db->addExpression($exp);
        $result = $db->selectOneRow();
        if (empty($result)) {
            return 0;
        } else {
            return $result['max'];
        }
    }

    public static function flipEmergency($reason_id)
    {
        $reason = self::build($reason_id);
        $reason->setShowEmergency(!$reason->getShowEmergency());
        self::saveResource($reason);
    }

    public static function flipAdminMenuShow($reason_id)
    {
        $reason = self::build($reason_id);
        $reason->setAdminMenuShow(!$reason->getAdminMenuShow());
        self::saveResource($reason);
    }

    public static function flipWaitListed($reason_id)
    {
        $reason = self::build($reason_id);
        $reason->setWaitListed(!$reason->getWaitListed());
        self::saveResource($reason);
    }

    public static function flipAskForPhone($reason_id)
    {
        $reason = self::build($reason_id);
        $reason->setAskForPhone(!$reason->getAskForPhone());
        self::saveResource($reason);
    }

}
