<?php

namespace counseling\Controller\Admin\Settings;

use counseling\Factory\Reason as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Reason extends \counseling\Controller\Base
{
    protected function getJsonView($data, \Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Settings command');
        }

        $json = array('success' => true);

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = Factory::listReasons();
                break;

            default:
                throw new \Exception('Unknown command');
        }

        $view = new \View\JsonView($json);

        return $view;
    }

    public function post(\Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Reason command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'flipEmergency':
                Factory::flipEmergency(filter_input(INPUT_POST, 'reasonId', FILTER_SANITIZE_NUMBER_INT));
                break;

            case 'flipWaitListed':
                Factory::flipWaitListed(filter_input(INPUT_POST, 'reasonId', FILTER_SANITIZE_NUMBER_INT));
                break;

            case 'flipAskForPhone':
                Factory::flipAskForPhone(filter_input(INPUT_POST, 'reasonId', FILTER_SANITIZE_NUMBER_INT));
                break;

            case 'setDescription':
                $this->setDescription();
                break;

            case 'setTitle':
                $this->setTitle();
                break;

            case 'setInstruction':
                $this->setInstruction();
                break;

            case 'setCategory':
                $this->setCategory();
                break;

            case 'delete':
                if (\Current_User::isDeity()) {
                    Factory::delete(filter_input(INPUT_POST, 'reasonId', FILTER_SANITIZE_NUMBER_INT));
                } else {
                    throw new \Exception('Action not allowed');
                }
                break;

            case 'pickColor':
                Factory::pickColor(filter_input(INPUT_POST, 'reasonId', FILTER_SANITIZE_NUMBER_INT),
                        filter_input(INPUT_POST, 'color', FILTER_SANITIZE_STRING));
                break;

        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);

        return $response;
    }

    public function getHtmlView($data, \Canopy\Request $request)
    {
        $content = 'Reasons HTML works';
        $view = new \View\HtmlView($content);

        return $view;
    }

    private function setDescription()
    {
        $reason = Factory::loadByPost();
        $reason->setDescription(Factory::pullPostString('description'));
        Factory::saveResource($reason);
    }

    private function setTitle()
    {
        $reason = Factory::loadByPost();
        $reason->setTitle(Factory::pullPostString('title'));
        Factory::saveResource($reason);
    }

    private function setInstruction()
    {
        $reason = Factory::loadByPost();
        $reason->setInstruction(Factory::pullPostInteger('instruction'));
        Factory::saveResource($reason);
    }

    private function setCategory()
    {
        $reason = Factory::loadByPost();
        $reason->setCategory(Factory::pullPostInteger('category'));
        Factory::saveResource($reason);
    }
}
