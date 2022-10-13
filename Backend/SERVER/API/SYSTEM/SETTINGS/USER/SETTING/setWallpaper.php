<?php
    header("Access-Control-Allow-Origin: *");
    $user=exec("whoami");
    $currentWifi=exec("iwgetid -r");

    $settings = json_decode(file_get_contents("/home/".$user."/.ZED/SETTINGS.json"),true);
    $settings['setting_wallpaperURL']=$_GET['path'];
    $newJsonString = json_encode($settings);

    if(isset($_GET['smartdesk']) and $currentWifi<>""){
        file_put_contents("/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json", $newJsonString);
    }else{
        file_put_contents("/home/".$user."/.ZED/SETTINGS.json", $newJsonString);
    }
?>