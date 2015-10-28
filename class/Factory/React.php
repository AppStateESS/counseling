<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class React
{
    public static function load($directory, $filename)
    {
        $script_file = 'src/' . $filename;

        $data['development'] = true;
        $data['addons'] = true;
        javascript('react', $data);
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/counseling/javascript/';
        $script_header = "<script type='text/jsx' src='$root_directory$directory$script_file'></script>";
        \Layout::addJSHeader($script_header, md5($directory . $script_file));
    }

}
