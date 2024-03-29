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
        case version_compare($version, '2.3.1', '<'):
            $content[] = <<<EOF
            <pre>2.3.1
--------------
+ Added react-fontawesome
</pre>
EOF;
        case version_compare($version, '2.3.2', '<'):
            $content[] = <<<EOF
            <pre>2.3.2
--------------
+ Bug fixes
</pre>
EOF;
        case version_compare($version, '2.3.3', '<'):
            $content[] = <<<EOF
            <pre>2.3.3
--------------
+ NPM update to address security concern.
</pre>
EOF;
        case version_compare($version, '2.3.4', '<'):
            $content[] = <<<EOF
            <pre>2.3.4
--------------
+ NPM update
</pre>
EOF;
        case version_compare($version, '3.0.1', '<'):
            $content[] = <<<EOF
            <pre>3.0.1
--------------
+ NPM update
</pre>
EOF;
        case version_compare($version, '3.1.0', '<'):
            $content[] = <<<EOF
            <pre>3.1.0
--------------
+ Package updates.
+ Swipe in is automatic.
+ Multiple error checks to prevent banner id = 0.
+ Added new options to appointment choices.
</pre>
EOF;
        case version_compare($version, '3.1.1', '<'):
            $content[] = <<<EOF
            <pre>3.1.1
--------------
+ Added new options to walk-in choices.
</pre>
EOF;
    }

    return true;
}
