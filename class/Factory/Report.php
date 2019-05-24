<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym.appstate.edu>
 */
class Report extends Base
{

    public static function daily(\Canopy\Request $request)
    {
        $datestamp = $request->shiftCommand();

        if (empty($datestamp) || !is_numeric($datestamp)) {
            $start_time = self::getTodayStartTime();
            $end_time = self::getTodayEndTime();
        } else {
            $start_time = strtotime($datestamp);
            $end_time = mktime(23, 59, 59, date('n', $start_time),
                    date('j', $start_time), date('Y', $start_time));
        }

        self::includeDatePicker($start_time, 'Daily');

        $visits = Visit::getDaysVisits($start_time, $end_time);
        $seen = array();
        $unseen = array();

        if (!empty($visits)) {
            foreach ($visits as $visit) {
                self::addIcon($visit);
                self::sortByReason($visit, $vars, false);
            }
        }
        $vars['date'] = strftime('%a, %B %e, %Y', $start_time);
        $vars['startTime'] = strftime('%Y%m%d', $start_time);
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('counseling', 'Admin/Report/daily.html');

        return $template->get();
    }

    private static function addIcon(&$visit)
    {
        if ($visit['has_emergency']) {
            $visit['icon'] = '<i class="text-danger fa-lg fa ' . CC_CATEGORY_EMERGENCY_ICON . '"></i>';
        } else {
            switch ($visit['category']) {
                case CC_CATEGORY_WALKIN:
                    $visit['icon'] = '<i class="fa ' . CC_CATEGORY_WALKIN_ICON . '"></i>';
                    break;
                case CC_CATEGORY_APPOINTMENT:
                    $visit['icon'] = '<i class="fa ' . CC_CATEGORY_APPOINTMENT_ICON . '"></i>';
                    break;
                case CC_CATEGORY_GROUP:
                    $visit['icon'] = '<i class="fa ' . CC_CATEGORY_GROUP_ICON . '"></i>';
                    break;
                case CC_CATEGORY_OTHER:
                    $visit['icon'] = '<i class="fa ' . CC_CATEGORY_OTHER_ICON . '"></i>';
                    break;
                default:
                    $visit['icon'] = '<i class="fa fa-question-circle"></i>';
                    break;
            }
        }
    }

    private static function sortByReason($visit, &$vars,
            $index_by_arrival = false)
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

    public static function weeklyCSV(\Canopy\Request $request)
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

        $download_file = 'Weekly Report ' . strftime('%Y%m%d', $start_of_week) . ' to ' .
                strftime('%Y%m%d', $end_of_week) . '.csv';

        return self::produceCSVReport($visits, $download_file);
    }

    public static function intervalCSV(\Canopy\Request $request)
    {
        $start_date = $request->shiftCommand();
        $end_date = $request->shiftCommand();

        if (empty($start_date) || !is_numeric($start_date) || empty($end_date) ||
                !is_numeric($end_date) || $start_date >= $end_date) {
            return '<p>Improperly formatted date. Cannot create report.</p>';
        }

        $start_time = strtotime($start_date);
        $end_time = strtotime($end_date);

        $start_month = date('m', $start_time);
        $start_day = date('d', $start_time);
        $start_year = date('Y', $start_time);

        $end_month = date('m', $end_time);
        $end_day = date('d', $end_time);
        $end_year = date('Y', $end_time);

        $start_of_interval = mktime(0, 0, 0, $start_month, $start_day,
                $start_year);
        $end_of_interval = mktime(23, 59, 59, $end_month, $end_day, $end_year);
        $visits = Visit::getDaysVisits($start_of_interval, $end_of_interval);

        $download_file = 'Interval Report ' . strftime('%Y%m%d',
                        $start_of_interval) . ' to ' .
                strftime('%Y%m%d', $end_of_interval) . '.csv';

        return self::produceCSVReport($visits, $download_file);
    }

    private static function produceCSVReport($visits, $download_file)
    {
        if (empty($visits)) {
            return '<p>No visits on this day. No CSV file created.</p>';
        }

        $csv = array();
        $csvRow[] = '"arrival time","purpose","complete reason","disposition","clinician","emergency","visit reason","banner_id","preferred_name","first name","last name","phone number","email","minutes waited"';

        foreach ($visits as $visit) {
            $sub = array();
            $sub[] = strftime('%c', $visit['arrival_time']);
            if ($visit['has_emergency']) {
                $sub[] = 'Emergency';
            } else {
                switch ($visit['category']) {
                    case CC_CATEGORY_APPOINTMENT:
                        $sub[] = 'Appointment';
                        break;
                    case CC_CATEGORY_GROUP:
                        $sub[] = 'Group';
                        break;
                    case CC_CATEGORY_OTHER:
                        $sub[] = 'Other';
                        break;
                    case CC_CATEGORY_WALKIN:
                        $sub[] = 'Walk-in';
                        break;
                }
            }
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
            $csvRow[] = '"' . implode('","', $sub) . '"';
        }
        $content = implode("\n", $csvRow);
        $filename = COUNSELING_TEMP_FOLDER . time() . '.csv';

        file_put_contents($filename, $content);

        header("Content-Disposition: attachment; filename=\"$download_file\"");
        header('Pragma: public');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        readfile($filename);
        exit();
    }

    public static function weekly(\Canopy\Request $request)
    {
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
                self::addIcon($visit);
                self::sortByReason($visit, $vars, true);
            }
        }
        $vars['date'] = strftime('%b %e, %Y', $start_of_week);
        $vars['startTime'] = strftime('%Y%m%d', $start_of_week);
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('counseling', 'Admin/Report/weekly.html');

        return $template->get();
    }

    public static function interval(\Canopy\Request $request)
    {
        $start_time_request = $request->shiftCommand();
        $end_time_request = $request->shiftCommand();

        if (empty($start_time_request) || !is_numeric($start_time_request)) {
            $start_time = self::getTodayStartTime();
        } else {
            $start_time = strtotime($start_time_request);
        }

        if (empty($end_time_request) || !is_numeric($end_time_request) ||
                $start_time_request >= $end_time_request) {
            $end_time = $start_time + 86400 * 7; // one week
        } else {
            $end_time = strtotime($end_time_request);
        }

        $start_month = date('m', $start_time);
        $start_day = date('d', $start_time);
        $start_year = date('Y', $start_time);

        $end_month = date('m', $end_time);
        $end_day = date('d', $end_time);
        $end_year = date('Y', $end_time);

        $start_of_interval = mktime(0, 0, 0, $start_month, $start_day,
                $start_year);
        $end_of_interval = mktime(23, 59, 59, $end_month, $end_day, $end_year);

        self::intervalDatePicker($start_of_interval, $end_of_interval);

        $visits = Visit::getDaysVisits($start_of_interval, $end_of_interval);
        $seen = array();
        $unseen = array();

        if (!empty($visits)) {
            foreach ($visits as $visit) {
                self::addIcon($visit);
                self::sortByReason($visit, $vars, true);
            }
        }
        $vars['start_date'] = strftime('%b %e, %Y', $start_of_interval);
        $vars['end_date'] = strftime('%b %e, %Y', $end_of_interval);
        $vars['startTime'] = strftime('%Y%m%d', $start_of_interval);
        $vars['endTime'] = strftime('%Y%m%d', $end_of_interval);
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('counseling', 'Admin/Report/interval.html');

        return $template->get();
    }

    public static function dailyCSV(\Canopy\Request $request)
    {
        $start_date = $request->shiftCommand();
        if (empty($start_date) || !is_numeric($start_date)) {
            return '<p>Improperly formatted date. Cannot create report.</p>';
        }
        $start_time = strtotime($start_date);
        $end_time = mktime(23, 59, 59, date('n', $start_time),
                date('j', $start_time), date('Y', $start_time));
        $visits = Visit::getDaysVisits($start_time, $end_time);
        $download_file = 'Daily Report ' . $start_date . '.csv';

        return self::produceCSVReport($visits, $download_file);
    }

    private static function includeDatePicker($start_time, $report_type)
    {
        $year = date('Y', $start_time);
        $month = date('n', $start_time) - 1;
        $day = date('j', $start_time);

        $script = "<script type='text/javascript'>const startDate = {year:$year, month:$month, day:$day};const reportType = '$report_type';</script>";
        \Layout::addJSHeader($script);
        $reactFactory = new React;
        $reactFactory->scriptView('Report');
    }

    private static function intervalDatePicker($start_time, $end_time)
    {
        $syear = date('Y', $start_time);
        $smonth = date('n', $start_time) - 1;
        $sday = date('j', $start_time);

        $eyear = date('Y', $end_time);
        $emonth = date('n', $end_time) - 1;
        $eday = date('j', $end_time);

        $startstr = strftime('%Y%m%d', $start_time);
        $endstr = strftime('%Y%m%d', $end_time);

        $script = "<script type='text/javascript'>const startStr= '$startstr';const endStr= '$endstr';const startDate = {year:$syear, month:$smonth, day:$sday};const endDate = {year:$eyear, month:$emonth, day:$eday};</script>";
        \Layout::addJSHeader($script);
        $reactFactory = new React;
        $reactFactory->scriptView('Report');
    }

}
