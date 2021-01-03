<?php
	header("Access-Control-Allow-Origin: *");
	$user=exec("whoami");
	$currentWifi=exec("iwgetid -r");
    if(isset($_GET['smartdesk']) and $currentWifi<>""){
		if(!file_exists("/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json")){
			copy("/home/".$user."/.ZED/SETTINGS.json","/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json");
		}
		$settings = file_get_contents("/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json");
    }else{
		$settings = file_get_contents("/home/".$user."/.ZED/SETTINGS.json");
    }
	echo $settings;
?>
