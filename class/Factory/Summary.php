<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Summary extends Base
{

    /**
     * 
     * @param array $arrivals
     */
    public static function getEstimatedWait(array $arrivals)
    {
        sort($arrivals);
        if (count($arrivals) == 1) {
            return $arrivals[0];
        }
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

    public static function totalCompleteToday($seen_only=false)
    {
        $starttime = mktime(0, 0, 0, date('n'), date('j'), date('Y'));
        $endtime = mktime(23, 59, 59, date('n'), date('j'), date('Y'));

        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addFieldConditional('complete_time', $starttime, '>');
        $tbl->addFieldConditional('complete_time', $endtime, '<');
        if ($seen_only) {
            $tbl->addFieldConditional('complete_reason', CC_COMPLETE_SEEN);
        }
        $tbl->addField(new \Database\Expression('count(' . $tbl->getField('id') . ')', 'visitCount'));
        return $db->selectColumn();
    }

    public static function averageToday()
    {
        $starttime = mktime(0, 0, 0, date('n'), date('j'), date('Y'));
        $endtime = mktime(23, 59, 59, date('n'), date('j'), date('Y'));

        $db = \Database::getDB();
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
        $starttime = mktime(0, 0, 0, date('n'), date('j'), date('Y'));
        $endtime = mktime(23, 59, 59, date('n'), date('j'), date('Y'));

        $db = \Database::getDB();
        $tbl = $db->addTable('cc_visit');
        $tbl->addField('has_emergency');
        $tbl2 = $db->addTable('cc_reason');
        $category = $tbl2->addField('category');
        $tbl->addFieldConditional('complete_time', $starttime, '>');
        $tbl->addFieldConditional('complete_time', $endtime, '<');
        $db->joinResources($tbl, $tbl2, new \Database\Conditional($db, $tbl->getField('reason_id'), $tbl2->getField('id'), '='));

        $result = $db->select();

        $tally = array('other' => 0, 'walkin' => 0, 'appointment' => 0, 'emergency' => 0);

        if (empty($result)) {
            return $tally;
        }
        foreach ($result as $val) {
            if ($val['has_emergency'] == '1') {
                $tally['emergency'] ++;
            } else {
                switch ($val['category']) {
                    case '0':
                        $tally['other']++;
                        break;
                    case '1':
                        $tally['walkin']++;
                        break;
                    case '2':
                        $tally['appointment']++;
                        break;
                }
            }
        }
        return $tally;
    }

}
