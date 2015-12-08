<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Report extends Base
{

    public static function view()
    {
        $visits = Visit::getTodaysVisits();
        $seen = array();
        $unseen = array();

        foreach ($visits as $visit) {
            if ($visit['complete_reason'] == CC_COMPLETE_SEEN) {
                $vars['seen'][] = $visit;
            } else {
                $vars['unseen'][] = $visit;
            }
        }
        $template = new \Template($vars);
        $template->setModuleTemplate('counseling', 'Admin/Report/daily.html');
        return $template->get();
    }

}
