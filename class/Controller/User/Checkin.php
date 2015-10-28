<?php

namespace counseling\Controller\User;

use counseling\Factory\Banner;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Checkin extends \counseling\Controller\Base
{

    protected function getJsonView($data, \Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown JSON command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'loginStudent':
                $json = $this->loginStudent();
                break;
        }

        $view = new \View\JsonView($json);
        return $view;
    }

    public function getHtmlView($data, \Request $request)
    {
        
    }

    private function loginStudent()
    {
        $student = filter_input(INPUT_GET, 'student', FILTER_SANITIZE_STRING);
        $jsonStudent = array('student'=>null);

        if (COUNSELING_FAKE_STUDENT) {
            if ($student == '123456789' || $student == 'barfoo') {
                $jsonStudent = Banner::fakeStudent();
            }
        } else {
            if (is_numeric($student) && strlen($student == 9)) {
                $jsonStudent = Banner::logInById($student);
            } else {
                $jsonStudent = Banner::logInByEmail($student);
            }
        }
        return $jsonStudent;
    }

}
