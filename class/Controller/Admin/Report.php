<?php

namespace counseling\Controller\Admin;

use counseling\Factory\Report as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Report extends \counseling\Controller\Base
{
    public function getHtmlView($data, \Request $request)
    {
        $command = $request->shiftCommand();
        if (empty($command)) {
            $command = 'Daily';
        }

        switch ($command) {
            case 'Daily':
                $content = Factory::daily($request);
                break;

            case 'Weekly':
                $content = Factory::weekly($request);
                break;
            
            case 'Interval':
                $content = Factory::interval($request);
                break;

            case 'DailyCSV':
                $content = Factory::dailyCSV($request);
                break;

            case 'WeeklyCSV':
                Factory::weeklyCSV($request);
                break;
            
            case 'IntervalCSV':
                Factory::intervalCSV($request);
                break;
        }
        $view = new \View\HtmlView($content);

        return $view;
    }
}
