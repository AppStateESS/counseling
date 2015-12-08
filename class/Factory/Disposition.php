<?php

namespace counseling\Factory;

use counseling\Resource\Disposition as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Disposition extends Base
{

    public static function getList($active_only = true)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_disposition');
        $tbl->addFieldConditional('active', 1);
        $tbl->addOrderBy('sorting');
        return $db->select();
    }

    public static function post()
    {
        $disposition_id = filter_input(INPUT_POST, 'dispositionId', FILTER_SANITIZE_NUMBER_INT);
        $disposition = self::build($disposition_id);
        $disposition->setTitle(self::pullPostString('title'));
        $disposition->setIcon(self::pullPostString('icon'));
        $disposition->setColor(self::pullPostString('color'));

        self::saveResource($disposition);
    }

    public static function build($id = 0)
    {
        $disposition = new Resource;
        if ($id) {
            $disposition->setId($id);
            if (!parent::loadByID($disposition)) {
                throw new \Exception('Disposition id not found:' . $id);
            }
        }
        return $disposition;
    }

    public static function delete($id)
    {
        $disposition = self::build($id);
        $disposition->setActive(false);
        $disposition->setSorting(0);
        self::saveResource($disposition);
    }
    
    public static function decreaseSorting($dis_id)
    {
        
    }

}
