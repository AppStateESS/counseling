<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class Summary extends Base
{
    /**
     * @param array $arrivals
     */
    public static function getEstimatedWait(array $arrivals)
    {
        if (empty($arrivals)) {
            return 0;
        }
        if (count($arrivals) == 1) {
            return $arrivals[0];
        }
        sort($arrivals);
        $total = count($arrivals);
        $offset = CC_AVERAGE_OFFSET;

        $odd = $total % 2;
        $median = ceil($total / 2);

        if (abs($offset) >= $median) {
            $offset = 0;
        }

        $middle = $median + $offset - $odd;
        $result = array_slice($arrivals, $middle);
        $remain_count = count($result);
        $sum = array_sum($result);
        $mean = floor($sum / $remain_count);

        /*
         * Not too sure about this formula so keeping this test for review.
          var_dump($arrivals);
          echo <<<EOF
          <pre>
          total = $total
          odd : $total % 2 = $odd
          median : ceil($total /2) : $median
          middle : $median + $offset - $odd = $middle
          result: array_slice (arrivals, $middle)
          EOF;
          var_dump($result);
          echo <<<EOF
          remain_count: count(result) = $remain_count
          sum : array_sum(result) = $sum
          mean : floor($sum / $remain_count) = $mean
          </pre>
          EOF;
         * 
         */
        return $mean;
    }

    public static function totalCompleteToday($seen_only = false)
    {
        $starttime = parent::getTodayStartTime();
        $endtime = parent::getTodayEndTime();

        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addFieldConditional('complete_time', $starttime, '>');
        $tbl->addFieldConditional('complete_time', $endtime, '<');
        if ($seen_only) {
            $tbl->addFieldConditional('complete_reason', CC_COMPLETE_SEEN);
        }
        $tbl->addField(new \phpws2\Database\Expression('count('.$tbl->getField('id').')', 'visitCount'));

        return $db->selectColumn();
    }

    public static function averageToday()
    {
        $starttime = parent::getTodayStartTime();
        $endtime = parent::getTodayEndTime();

        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addFieldConditional('complete_time', $starttime, '>');
        $tbl->addFieldConditional('complete_time', $endtime, '<');
        $tbl->addField('arrival_time');
        $tbl->addField('complete_time');
        $result = $db->select();
        if (empty($result)) {
            return 0;
        }
        foreach ($result as $val) {
            $time_dir = $val['complete_time'] - $val['arrival_time'];
            $minutes[] = floor($time_dir / 60);
        }
        $average = floor(array_sum($minutes) / count($minutes));

        return $average;
    }

    public static function completeTally()
    {
        $starttime = parent::getTodayStartTime();
        $endtime = parent::getTodayEndTime();

        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addField('has_emergency');
        $tbl2 = $db->addTable('cc_reason');
        $category = $tbl2->addField('category');
        $tbl->addFieldConditional('complete_time', $starttime, '>');
        $tbl->addFieldConditional('complete_time', $endtime, '<');
        $db->joinResources($tbl, $tbl2, new \phpws2\Database\Conditional($db, $tbl->getField('reason_id'), $tbl2->getField('id'), '='));

        $result = $db->select();

        $tally = array('other' => 0, 'walkin' => 0, 'appointment' => 0, 'emergency' => 0);

        if (empty($result)) {
            return $tally;
        }
        foreach ($result as $val) {
            if ($val['has_emergency'] == '1') {
                ++$tally['emergency'];
            } else {
                switch ($val['category']) {
                    case CC_CATEGORY_OTHER:
                        $tally['other']++;
                        break;
                    case CC_CATEGORY_WALKIN:
                        $tally['walkin']++;
                        break;
                    case CC_CATEGORY_APPOINTMENT:
                    case CC_CATEGORY_GROUP:
                        $tally['appointment']++;
                        break;
                }
            }
        }

        return $tally;
    }

    public static function unseenReasons()
    {
        $starttime = parent::getTodayStartTime();
        $endtime = parent::getTodayEndTime();

        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $complete_reason = $tbl->addField('complete_reason');
        $tbl->addFieldConditional('complete_time', $starttime, '>');
        $tbl->addFieldConditional('complete_time', $endtime, '<');
        $tbl->addFieldConditional('complete_reason', CC_COMPLETE_SEEN, '!=');
        $tbl->addField(new \phpws2\Database\Expression('count('.$tbl->getField('id').')', 'visitCount'));
        $db->setGroupBy($complete_reason);
        $result = $db->select();

        if (empty($result)) {
            return;
        }
        foreach ($result as $key => $val) {
            switch ((int) $val['complete_reason']) {
                case CC_COMPLETE_LEFT:
                    $reasons[] = '('.$val['visitCount'].') Had to leave';
                    break;

                case CC_COMPLETE_MISSING:
                    $reasons[] = '('.$val['visitCount'].') Missing when called';
                    break;

                case CC_COMPLETE_APPOINTMENT:
                     $reasons[] = '('.$val['visitCount'].') Made an later appointment';
                    break;

                case CC_COMPLETE_SENT_BACK:
                     $reasons[] = '('.$val['visitCount'].') Sent back to appointment';
                    break;
            }
        }

        return $reasons;
    }
}
