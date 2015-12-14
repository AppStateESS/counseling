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
        if (empty($disposition_id)) {
            $disposition->setSorting(self::getLastSorting('cc_disposition') + 1);
        }

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

    private static function countDispositions()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('cc_disposition');
        $tbl->addFieldConditional('active', 1);
        $tbl->addField(new \Database\Expression('count(' . $tbl->getField('id') . ')', 'count'));
        $count = $db->selectColumn();
        return $count;
    }

    public static function sort($moved_id, $prev_id, $next_id)
    {
        // decrement sorting number of all previous up to moved

        $moved_obj = self::build($moved_id);
        $moved_sort = $moved_obj->getSorting();

        if (!empty($prev_id)) {
            $prev_obj = self::build($prev_id);
            $prev_sort = $prev_obj->getSorting();
        } else {
            $prev_sort = 1;
        }

        if (!empty($next_id)) {
            $next_obj = self::build($next_id);
            $next_sort = $next_obj->getSorting();
        } else {
            $next_sort = self::countDispositions();
        }

        $db = \Database::getDB();
        $tbl = $db->addTable('cc_disposition');
        $tbl->addFieldConditional('active', 1);

        if ($moved_sort > $prev_sort) {
            // moved downward, increase all above
            $tbl->addFieldConditional('sorting', $next_sort, '>=');
            $tbl->addFieldConditional('sorting', $moved_sort, '<');
            $exp = $db->getExpression('sorting + 1');
            $moved_obj->setSorting($next_sort);
        } else {
            // moved upward, decrease all below
            $tbl->addFieldConditional('sorting', $prev_sort, '<=');
            $tbl->addFieldConditional('sorting', $moved_sort, '>');
            $exp = $db->getExpression('sorting - 1');
            $moved_obj->setSorting($prev_sort);
        }

        $tbl->addValue('sorting', $exp);
        $db->update();

        self::saveResource($moved_obj);
    }

}
