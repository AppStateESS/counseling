<?php

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
function counseling_install(&$content)
{
    $db = \phpws2\Database::newDB();
    $db->begin();

    try {
        $clinician = new \counseling\Resource\Clinician;
        $clinician->createTable($db);

        $disposition = new \counseling\Resource\Disposition;
        $disposition->createTable($db);

        $reason = new \counseling\Resource\Reason;
        $reason->createTable($db);

        $visit = new \counseling\Resource\Visit;
        $visit->createTable($db);

        $visitor = new \counseling\Resource\Visitor;
        $visitor->createTable($db);

    } catch (\Exception $e) {
        $db->buildTable('cc_clinician')->drop(true);
        $db->buildTable('cc_disposition')->drop(true);
        $db->buildTable('cc_reason')->drop(true);
        $db->buildTable('cc_visit')->drop(true);
        $db->buildTable('cc_visitor')->drop(true);
        
        $db->rollback();
        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}
