<?php 

/**
 * Pause Developer Application Script
 *
 * This script will submit your resume to Pause's server.
 * Fix the bugs, fill in the missing code, and run it to apply for the job.
 * Requires the CURL module to be loaded in your PHP installation.
 *
 * Please Note: While this sample test is written in php, we encourage you
 * to rewrite this code in the language of your choice, we simply require
 * the submission to our server to match, how you do it is completely up
 * to you!
 *
 * (c) 2013 Pause Productions
 */

// This should point to the resume file you want to submit.
// Note this is a path to the file on your local hard drive,
// not the contents of the file. For best results, use PDF,
// RTF, DOC, DOCX, or TXT.
define('APPLICATION_SERVER', 'http://jobs.pause.ca/submit.php');

$resumefile = '/home/rveldpau/Downloads/resume-2015-01-30.pdf';

// Your full name
$name = 'Rob Veldpaus';

// Your phone number
$phone = '905-912-5134';

// Your email address
$email = 'rob.veldpaus@gmail.com';

// The message we want to send
$subject = 'My developer application';

// Any additional notes you wish to include
// Bonus points if you discover the security issue with this script or
// have ideas for improvements and note them here.
$notes = 'While my position at COM DEV is mostly Java based, I am currently writing a JavaScript based game engine which will have a back-end of OO PHP';

// Prepare the payload
$vars = ['name' => $name,
	'phone' => $phone,
	'email' => $email,
	'subject' => $subject,
	'notes' => $notes,
	'time' => time()
       ];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, APPLICATION_SERVER);
curl_setopt($ch, CURLOPT_POSTFIELDS, $vars);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

//decode the json encoded response
$responseVars = json_decode($response, true);

$vars['application-id'] = $responseVars['application-id'];
$key = $responseVars['application-secret-key'];


// You must write the code that generates the signature to sign the application
// request. This is very similar to how other web services handle signatures,
// so you may be familiar with the process. Here's how to do it:

// 1) Sort the $vars array by key
ksort($vars);

// 2) Convert the sorted $vars array to an http query string (eg: var1=abc&var2=def)
// Note this string should not be prepended with ?, http://, or anything else,
// it should look like the example string above...
$signature = http_build_query($vars);

// 3) Concatenate the string from step 2 and $key (string then $key)
$signature = $signature . $key;

// 4) Hash the resulting string from step 3 using SHA256. This is your signature.
$signature = hash('sha256', $signature);

// 5) Add the signature to the $vars array as 'sig' (done for you, below)
$vars['sig'] = $signature;

// Check that the file exists
if (!file_exists($resumefile)) {
	die('ERROR: Cannot find local file '.$resumefile."\n");
}

// Add the file to upload
$vars['resume'] = '@'.$resumefile;

// Include this script (we'd like to see your work please!)
$vars['script'] = '@'.__FILE__;

// Post the data to Pause's server
print "Submitting application...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, APPLICATION_SERVER);
curl_setopt($ch, CURLOPT_POSTFIELDS, $vars);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);

// If we got back "OK" then it was submitted successfully.
// Otherwise it should tell us what went wrong.
if ($response=='OK') {
	print "Resume sent successfully, thank you for applying!\n";
}
else {
	print "Error: $response\n";
}
