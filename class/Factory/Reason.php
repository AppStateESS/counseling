<?php

namespace counseling\Factory;

use counseling\Resource\Reason as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Reason extends Base
{

    public static function listReasons($active_only = true)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_reason');
        $tbl->addOrderBy('sorting');
        if ($active_only) {
            $tbl->addFieldConditional('active', 1);
        }
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
            if (!parent::loadByID($reason)) {
                throw new \Exception('Reason id not found:' . $id);
            }
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
        $reason->setCategory(self::pullPostInteger('category'));
        $reason->setWaitListed(self::pullPostCheck('waitListed'));
        $reason->setAskForPhone(self::pullPostCheck('askForPhone'));
        if (empty($reason_id)) {
            $reason->setSorting(self::getLastSorting('cc_reason') + 1);
        }

        self::saveResource($reason);
    }

    public static function flipEmergency($reason_id)
    {
        $reason = self::build($reason_id);
        $wait_listed = $reason->getWaitListed();
        $show_emergency = $reason->getShowEmergency();

        // if emergency question is asked, they have to be on wait list
        if (!$wait_listed && !$show_emergency) {
            $reason->setWaitListed(true);
        }

        $reason->setShowEmergency(!$show_emergency);
        self::saveResource($reason);
    }

    public static function flipWaitListed($reason_id)
    {
        $reason = self::build($reason_id);
        $wait_listed = $reason->getWaitListed();
        $show_emergency = $reason->getShowEmergency();

        // if wait list is off, you can't show the emergency question
        if ($wait_listed && $show_emergency) {
            $reason->setShowEmergency(false);
        }
        $reason->setWaitListed(!$wait_listed);
        self::saveResource($reason);
    }

    public static function flipAskForPhone($reason_id)
    {
        $reason = self::build($reason_id);
        $reason->setAskForPhone(!$reason->getAskForPhone());
        self::saveResource($reason);
    }

    public static function delete($reason_id)
    {
        $reason = self::build($reason_id);
        $reason->setActive(false);
        self::saveResource($reason);
    }

    public static function pickColor($reason_id, $color)
    {
        $reason = self::build($reason_id);
        $reason->setColor($color);
        self::saveResource($reason);
    }
}
