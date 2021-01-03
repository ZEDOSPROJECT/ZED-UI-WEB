<?php
    header("Access-Control-Allow-Origin: *");
    $url = $_GET['url']; 
    $user=exec("whoami");

    $currentWifi=exec("iwgetid -r");
    if($currentWifi<>""){
		if(!file_exists("/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json")){
			copy("/home/".$user."/.ZED/SETTINGS.json","/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json");
		}
        
        $settings = json_decode(file_get_contents("/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json"),true);
        $settings['setting_wallpaperURL']="Online.jpg";
        $newJsonString = json_encode($settings);
        file_put_contents("/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json", $newJsonString);
    }else{
		$settings = json_decode(file_get_contents("/home/".$user."/.ZED/SETTINGS.json"),true);
        $settings['setting_wallpaperURL']="Online.jpg";
        $newJsonString = json_encode($settings);
        file_put_contents("/home/".$user."/.ZED/SETTINGS.json", $newJsonString);s
    }

    file_put_contents( $_SERVER['DOCUMENT_ROOT']."/Wallpapers/Images/Online.jpg", fopen($url, 'r'));
?>