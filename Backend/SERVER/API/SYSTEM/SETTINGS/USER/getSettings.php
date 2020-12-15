<?php
	header("Access-Control-Allow-Origin: *");
	$user=exec("whoami");
   	$settings = file_get_contents("/home/".$user."/.ZED/SETTINGS.json");
	echo $settings;
?>
