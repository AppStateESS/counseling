<?php

namespace counseling\Controller;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
abstract class Base extends \phpws2\Http\Controller
{
    public function get(\Canopy\Request $request)
    {
        $data = array();
        $view = $this->getView($data, $request);
        $response = new \Canopy\Response($view);

        return $response;
    }
}
