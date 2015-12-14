<?php

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */

define('COUNSELING_DEFINE_VERSION', '1.0');

define('COUNSELING_REACT_DEV', true);

define('COUNSELING_FAKE_VISITOR', true);

define('COUNSELING_SIT_INSTRUCTION', 'Please have a seat in the lobby area. One of our counselors will speak with you shortly.');
define('COUNSELING_FRONT_DESK_INSTRUCTION', 'Please see one of our staff members at the front desk for your next step.');


define('CC_CATEGORY_OTHER', 0);
define('CC_CATEGORY_WALKIN', 1);
define('CC_CATEGORY_APPOINTMENT', 2);
define('CC_CATEGORY_EMERGENCY', 3);

define('CC_CATEGORY_OTHER_ICON', 'fa-question-circle');
define('CC_CATEGORY_EMERGENCY_ICON', 'fa-exclamation-triangle');
define('CC_CATEGORY_WALKIN_ICON', 'fa-male');
define('CC_CATEGORY_APPOINTMENT_ICON', 'fa-clock-o');

define('CC_AVERAGE_OFFSET', 0);

define('CC_COMPLETE_SEEN', 1);
define('CC_COMPLETE_LEFT', 2);
define('CC_COMPLETE_MISSING', 3);
define('CC_COMPLETE_APPOINTMENT', 4);

define('COUNSELING_TEMP_FOLDER', '/tmp/');

define('COUNSELING_BANNER_URL', 'http://url.to.banner.api/');