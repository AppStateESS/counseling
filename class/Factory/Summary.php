<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Summary extends Base
{
    public static function getSummaryData()
    {
        $data['totalWaiting'] = 3;
        $data['estimatedWait'] = 40;
        $data['waitingTally'] = self::waitingTally();
        $data['totalSeen'] = 13;
        $data['averageWait'] = 32;
        return $data;
    }
    
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
}
