<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Summary extends Base
{
    public static function waitingTally()
    {
        // Separate from other reasons
        $tally[] = array('title' => 'Emergency', 'tally'=> 1);
        
        $tally[] = array('title' => 'Walk-in', 'tally'=> 2);
        $tally[] = array('title' => 'Appointment', 'tally'=> 1);
        // not listed dumped here
        $tally[] = array('title' => 'Other', 'tally'=> 1);
        return $tally;
    }
    
    /**
     * 
     * @param array $arrivals
     */
    public static function getEstimatedWait(array $arrivals)
    {
        if (count($arrivals) == 1) {
            return $arrivals[0];
        }
        
        $total = count($arrivals);
        $odd = $total % 2;
        $middle = ceil($total / 2) + CC_AVERAGE_OFFSET - $odd;
        $result = array_slice($arrivals, $middle);
        $remain_count = count($result);
        $sum = array_sum($result);
        $mean = floor($sum / $remain_count);
        return $mean;
    }
}
