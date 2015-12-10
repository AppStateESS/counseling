<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Report extends Base
{

    public static function daily(\Request $request)
    {
        javascript('datepicker');
        $script = '<script type="text/javascript" src="' . PHPWS_HOME_HTTP . 'mod/counseling/javascript/Admin/Report/script.js"></script>';
        
        $datestamp = $request->shiftCommand();
        if (empty($datestamp)) {
            $start_time = self::getTodayStartTime();
            $end_time = self::getTodayEndTime();
        } else {
            $start_time = strtotime($datestamp);
            $end_time = mktime(23, 59, 59, date('n', $start_time), date('j', $start_time), date('Y', $start_time));
        }
        
        \Layout::addJSHeader($script);
        
        $visits = Visit::getDaysVisits($start_time, $end_time);
        $seen = array();
        $unseen = array();

        if (!empty($visits)) {
            foreach ($visits as $visit) {
                if ($visit['complete_reason'] == CC_COMPLETE_SEEN) {
                    $vars['seen'][] = $visit;
                } else {
                    $vars['unseen'][] = $visit;
                }
            }
        }
        $vars['date'] = strftime('%a, %B %e, %Y', $start_time);
        $vars['startTime'] = strftime('%Y%m%d', $start_time);
                
        $template = new \Template($vars);
        $template->setModuleTemplate('counseling', 'Admin/Report/daily.html');
        return $template->get();
    }

}
