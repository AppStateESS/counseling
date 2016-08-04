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
        javascript('jquery');
        $datestamp = $request->shiftCommand();

        if (empty($datestamp) || !is_numeric($datestamp)) {
            $start_time = self::getTodayStartTime();
            $end_time = self::getTodayEndTime();
        } else {
            $start_time = strtotime($datestamp);
            $end_time = mktime(23, 59, 59, date('n', $start_time), date('j', $start_time), date('Y', $start_time));
        }

        self::includeDatePicker($start_time, 'Daily');

        $visits = Visit::getDaysVisits($start_time, $end_time);
        $seen = array();
        $unseen = array();

        if (!empty($visits)) {
            foreach ($visits as $visit) {
                self::sortByReason($visit, $vars, false);
            }
        }

        $vars['date'] = strftime('%a, %B %e, %Y', $start_time);
        $vars['startTime'] = strftime('%Y%m%d', $start_time);

        $template = new \Template($vars);
        $template->setModuleTemplate('counseling', 'Admin/Report/daily.html');

        return $template->get();
    }

    private static function sortByReason($visit, &$vars, $index_by_arrival = false)
    {
        $arrival_time = strftime('%Y%m%d', $visit['arrival_time']);
        switch ($visit['complete_reason']) {
            case CC_COMPLETE_SEEN:
                if ($index_by_arrival) {
                    $vars['seen'][$arrival_time][] = $visit;
                } else {
                    $vars['seen'][] = $visit;
                }
                break;

            case CC_COMPLETE_SENT_BACK:
                if ($index_by_arrival) {
                    $vars['appointment'][$arrival_time][] = $visit;
                } else {
                    $vars['appointment'][] = $visit;
                }
                break;

            default:
                if ($index_by_arrival) {
                    $vars['unseen'][$arrival_time][] = $visit;
                } else {
                    $vars['unseen'][] = $visit;
                }
        }
    }

    public static function weeklyCSV(\Request $request)
    {
        $start_date = $request->shiftCommand();
        if (empty($start_date) || !is_numeric($start_date)) {
            return '<p>Improperly formatted date. Cannot create report.</p>';
        }
        $start_time = strtotime($start_date);

        $day_of_the_week = date('w', $start_time);
        $start_month = date('m', $start_time);
        $start_day = date('d', $start_time) - $day_of_the_week;
        $start_year = date('Y', $start_time);
        $end_day = $start_day + 6;

        $start_of_week = mktime(0, 0, 0, $start_month, $start_day, $start_year);
        $end_of_week = mktime(23, 59, 59, $start_month, $end_day, $start_year);
        $visits = Visit::getDaysVisits($start_of_week, $end_of_week);

        $download_file = 'Weekly Report '.strftime('%Y%m%d', $start_of_week).' to '.
                strftime('%Y%m%d', $end_of_week).'.csv';

        return self::produceCSVReport($visits, $download_file);
    }

    private static function produceCSVReport($visits, $download_file)
    {
        if (empty($visits)) {
            return '<p>No visits on this day. No CSV file created.</p>';
        }

        $csv = array();
        $csvRow[] = '"arrival time","complete reason","disposition","clinician","emergency","visit reason","banner_id","preferred_name","first name","last name","phone number","email","minutes waited"';

        foreach ($visits as $visit) {
            $sub = array();
            $sub[] = strftime('%c', $visit['arrival_time']);
            $sub[] = $visit['complete_reason_title'];
            if ($visit['disposition_id']) {
                $sub[] = $visit['disposition'];
                $sub[] = $visit['clinician'];
            } else {
                $sub[] = 'N/A';
                $sub[] = 'N/A';
            }
            $sub[] = $visit['has_emergency'] ? 'Yes' : 'No';
            $sub[] = $visit['complete_reason_title'];
            $sub[] = $visit['banner_id'] = $visit['visitor']['banner_id'];
            $sub[] = $visit['preferred_name'] = $visit['visitor']['preferred_name'];
            $sub[] = $visit['first_name'] = $visit['visitor']['first_name'];
            $sub[] = $visit['last_name'] = $visit['visitor']['last_name'];
            $sub[] = $visit['phone_number'] = $visit['visitor']['phone_number'];
            $sub[] = $visit['email'] = $visit['visitor']['email'];
            $sub[] = $visit['wait_time'];
            $csvRow[] = '"'.implode('","', $sub).'"';
        }
        $content = implode("\n", $csvRow);
        $filename = COUNSELING_TEMP_FOLDER.time().'.csv';

        file_put_contents($filename, $content);

        header("Content-Disposition: attachment; filename=\"$download_file\"");
        header('Pragma: public');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        readfile($filename);
        exit();
    }

    public static function weekly(\Request $request)
    {
        javascript('datepicker');

        $datestamp = $request->shiftCommand();
        if (empty($datestamp) || !is_numeric($datestamp)) {
            $start_time = self::getTodayStartTime();
        } else {
            $start_time = strtotime($datestamp);
        }

        $day_of_the_week = date('w', $start_time);
        $start_month = date('m', $start_time);
        $start_day = date('d', $start_time) - $day_of_the_week;
        $start_year = date('Y', $start_time);
        $end_day = $start_day + 6;

        $start_of_week = mktime(0, 0, 0, $start_month, $start_day, $start_year);
        $end_of_week = mktime(23, 59, 59, $start_month, $end_day, $start_year);

        self::includeDatePicker($start_of_week, 'Weekly');

        $visits = Visit::getDaysVisits($start_of_week, $end_of_week);
        $seen = array();
        $unseen = array();

        if (!empty($visits)) {
            foreach ($visits as $visit) {
                self::sortByReason($visit, $vars, true);
            }
        }
        $vars['date'] = strftime('%b %e, %Y', $start_of_week);
        $vars['startTime'] = strftime('%Y%m%d', $start_of_week);
        $template = new \Template($vars);
        $template->setModuleTemplate('counseling', 'Admin/Report/weekly.html');

        return $template->get();
    }

    public static function dailyCSV(\Request $request)
    {
        $start_date = $request->shiftCommand();
        if (empty($start_date) || !is_numeric($start_date)) {
            return '<p>Improperly formatted date. Cannot create report.</p>';
        }
        $start_time = strtotime($start_date);
        $end_time = mktime(23, 59, 59, date('n', $start_time), date('j', $start_time), date('Y', $start_time));
        $visits = Visit::getDaysVisits($start_time, $end_time);
        $download_file = 'Daily Report '.$start_date.'.csv';

        return self::produceCSVReport($visits, $download_file);
    }

    private static function includeDatePicker($start_time, $report_type)
    {
        $year = date('Y', $start_time);
        $month = date('n', $start_time) - 1;
        $day = date('j', $start_time);

        $script = "<script type='text/javascript'>var defaultDate = {year:$year, month:$month, day:$day};var reportType = '$report_type';</script>"
                .'<script type="text/javascript" src="'.PHPWS_SOURCE_HTTP.'mod/counseling/javascript/Admin/Report/script.js"></script>';
        \Layout::addJSHeader($script);
        javascript('datepicker');
    }
}
