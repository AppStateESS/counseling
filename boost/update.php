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
            $content[] = <<<EOF
<pre>2.0.0
--------------
+ Added color highlighting to reasons
+ Disposition color type changed to match reason's
</pre>
EOF;
        case version_compare($version, '2.1.0', '<'):
            $db = \phpws2\Database::getDB();
            $tbl = $db->addTable('cc_visit');
            $dt = new \phpws2\Database\Datatype\Smallint($tbl, 'category');
            $dt->add();
            $db->clearTables();
            $reason = $db->addTable('cc_reason');
            $reason->dropColumn('wait_listed');
            $content[] = <<<EOF
<pre>2.1.0
--------------
+ Adding 'category' flag to visits, handles wait status now.
</pre>
EOF;
        case version_compare($version, '2.2.0', '<'):
            $db = \phpws2\Database::getDB();
            $tbl = $db->addTable('cc_visit');
            $dt = new \phpws2\Database\Datatype\Integer($tbl, 'location_id');
            $dt->setDefault(0);
            $dt->add();
            $db->clearTables();
            $tbl2 = $db->buildTable('cc_location');
            $tbl2->addPrimaryIndexId();
            $tbl2->addDataType('title', 'varchar');
            $active = $tbl2->addDataType('active', 'smallint');
            $active->setDefault(1);
            $tbl2->create();
            $content[] = <<<EOF
            <pre>2.2.0
--------------
+ Added location
+ Removed grunt
</pre>
EOF;
        case version_compare($version, '2.2.1', '<'):
            $content[] = <<<EOF
            <pre>2.2.1
--------------
+ Added travis
</pre>
EOF;

        case version_compare($version, '2.2.2', '<'):
            $content[] = <<<EOF
            <pre>2.2.2
--------------
+ Added new leave reason
</pre>
EOF;
    }

    return true;
}
