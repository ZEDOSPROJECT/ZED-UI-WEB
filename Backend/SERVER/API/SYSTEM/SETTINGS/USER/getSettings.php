<?php
    header("Access-Control-Allow-Origin: *");
   	$settings = file_get_contents('SETTINGS.json');
	echo $settings;
?>
