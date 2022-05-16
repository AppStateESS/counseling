# Counseling Setup

The Counseling module (which I will refer to as "counseling" below) has the following server LAMP requirements:
* Linux/Unix
* Apache web server (or Nginx which is what we now use)
* PHP 7.0 or higher
* MySQL/MariaDB. It should work with PostGreSQL but I haven't tested it.

You will also need to install the Canopy content management system.

Installing counseling works like other modules in Canopy.

1. Install Canopy from Github. Canopy does not have a release so you will need to download it a Git copy: https://github.com/AppStateESS/canopy/archive/refs/heads/master.zip
   I will warn you that Canopy at its heart is old and setup can be finicky. That said, we use it daily and have done so for years.
2. Download the counseling module from Github. https://github.com/AppStateESS/counseling/releases
3. Untar and unzip the release in the `canopy/mod` directory.
4. Go to the Boost module in the Canopy control panel and install Counseling.
5. Go to the `canopy/mod/counseling/conf/` directory and copy `defines.dist.php` to `defines.php` in the same directory.
6. Enter your COUNSELING_BANNER_URL in the `defines.php` file and save it (more below).
7. Create a theme that includes Bootstrap 4.6.x.
8. You are ready to go.

## defines.php

Here are the current (as of this writing) setting parameters with example values.

```
define('COUNSELING_DEFINE_VERSION', '1.0');

define('COUNSELING_REACT_DEV', false);

define('COUNSELING_FAKE_VISITOR', false);

define('COUNSELING_BANNER_URL', 'https://address.to.university.student.api/{id}?authenticationInformation=12345');

define('COUNSELING_TEMP_FOLDER', '/tmp/');
```

### COUNSELING_DEFINE_VERSION

Not used anymore. Ignore it.

### COUNSELING_REACT_DEV

This is a define that switches into development mode. When `TRUE`, counseling will look in `javascript/dev/` for its Javascript files. This would only be useful if you
want to update the code. If you know React and how to compile with Babel/Webpack, give it a shot. Otherwise, leave this as `FALSE`, in which case the module will look in `javascript/build/` for its production compiles.

### COUNSELING_FAKE_VISITOR

When set to `TRUE`, counseling will not try to contact your student endpoint. It will just create fake students on-the-fly.

### COUNSELING_BANNER_URL

This is a link to student database endpoint. The system will send a GET request to this endpoint to receive a JSON response. The authenticationInformation variable is just a suggestion. We use an user name and hashed token. We run this process through an administrative VLAN in-accessible off campus. More about the API is below.

### COUNSELING_TEMP_FOLDER

When counseling creates reports, it make a temporary copy before pushing it for download. This is directory where the copy is saved. `/tmp/` is a standard directory in Unix for this process as it is cleaned up regularly.

## Student API

We use the student API to identify students and get information that we copy into the table `cc_visitor`. Here are the tables fields:

- id
- banner_id
- first_name
- preferred_name
- first_visit
- seen_last_visit
- last_name
- last_visit
- phone_number
- email
- intake_complete
- previously_seen

The information needed to create this record is:

- First name
- Last name
- Preferred name
- Phone number
- Email

We query this information using the student's Banner ID. The API will return a match in JSON:

```
{
  "bannerID": 123456789,
  "emailAddress": "studentemail@university.edu",
  "firstName": "Joseph",
  "lastName": "Blow",
  "phoneNumber": "828 555 1212",
  "preferredName": "Jo",
}
```

A failure returns:

```
{
    "message": "No Results Found"
}
```

When the student enters or scans in their Banner ID, counseling first matches the Banner ID against the database. If not found, it checks the endpoint. If successful, it creates the database record. If it fails, an error message is shown to the user.

## Visitor interface

At Appalachian State, the Counseling Center uses a kiosk near the front door. The kiosk uses software that prevents tampering by the user. When it boots up, it goes straight to the site. The kiosk prevents any internet use outside of our program. Your Networking or OS group will have more information about this software. We use an Open Source program running on Linux.

Attached to the monitor is an unencrypted, magnetic card reader. Our current AppCards (everything is App or Yosef-something here) are just a simple strip with the student's Banner ID. Students without their card can just type in their ID. After a nine digit entry, the ID is sent to the endpoint for confirmation. On a positive interaction, they continue through the process. On failure, it instructs them to see the front desk. Regardless of outcome, the interface resets itself for the next visitor.

The "AppCard" information is coded into the program and is not easily changed. Should I be asked, I could change this to an admin setting.

## The Code Base

This module was written in 2015; seven years ago and just two years after the first release of React. As such, the code is a little old. It is currently running fine so there hasn't been much need to revisit it. Revising the code for someone using current React standards (hooks and the like) may be challenging.

The NPM packages are very basic and consist mostly of compiling tools. Package deprecation should not be a problem.

The PHP version was 5.x at the time of counseling's release. It is running currently on a PHP 7.x server without issue.

Should interest arise, the code could be revisited and updated to more current standards.
