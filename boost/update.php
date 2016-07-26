<?php


function counseling_update(&$content, $version)
{
    switch ($version) {
        case version_compare($version, '2.0.0', '<'):
            $db = \phpws2\Database::getDB();
            $db->exec("update cc_disposition set color = replace(color, 'btn-', '')");
            $tbl = $db->addTable('cc_reason');
            $dt = new \phpws2\Database\Datatype\Varchar($tbl, 'color');
            $dt->setSize(20);
            $dt->add();
            $tbl->addValue('color', 'default');
            $db->update();
    }

    return true;
}
