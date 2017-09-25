<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class React
{

    public function scriptView($view_name, $add_anchor = true)
    {
        static $vendor_included = false;
        if (!$vendor_included) {
            $script[] = $this->getScript('vendor');
            $vendor_included = true;
        }
        $script[] = $this->getScript($view_name);
        $react = implode("\n", $script);
        if ($add_anchor) {
            $content = <<<EOF
<div id="$view_name"></div>
$react
EOF;
            return $content;
        } else {
            return $react;
        }
    }

    protected function getRootDirectory()
    {
        return PHPWS_SOURCE_HTTP . 'mod/counseling/';
    }

    private function getScript($scriptName)
    {
        $root_directory = $this->getRootDirectory() . 'javascript/';
        if (COUNSELING_REACT_DEV) {
            $path = "dev/$scriptName.js";
        } else {
            $path = $this->getAssetPath($scriptName);
        }
        $script = "<script type='text/javascript' src='{$root_directory}$path'></script>";
        return $script;
    }

    private function getAssetPath($scriptName)
    {
        $jsonRaw = file_get_contents($this->getRootDirectory() . 'assets.json');
        $json = json_decode($jsonRaw, true);
        if (!isset($json[$scriptName]['js'])) {
            throw new \Exception('Script file not found among assets.');
        }
        return $json[$scriptName]['js'];
    }

}
