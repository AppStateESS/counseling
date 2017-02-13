<?php

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */

function counseling_uninstall(&$content)
{
    $db = \phpws2\Database::newDB();

    $db->buildTable('cc_clinician')->drop(true);
    $db->buildTable('cc_disposition')->drop(true);
    $db->buildTable('cc_reason')->drop(true);
    $db->buildTable('cc_visit')->drop(true);
    $db->buildTable('cc_visitor')->drop(true);
    return true;
}