<?php
    header("Access-Control-Allow-Origin: *");
    $user=exec("whoami");
    $path_info = pathinfo($_GET['path']);
    $finalFile = uniqid()."_EXTERNAL.".$path_info['extension'];
    $currentWifi=exec("iwgetid -r");
    foreach (scandir($_SERVER['DOCUMENT_ROOT']."/Wallpapers/Images/") as $filename) {
        if (strpos($filename, '_EXTERNAL.') !== false) {
            unlink($_SERVER['DOCUMENT_ROOT']."/Wallpapers/Images/".$filename);
        }
    }
    copy($_GET['path'] , $_SERVER['DOCUMENT_ROOT']."/Wallpapers/Images/".$finalFile);
    $settings = json_decode(file_get_contents("/home/".$user."/.ZED/SETTINGS.json"),true);
    $settings['setting_wallpaperURL']=$finalFile;
    $newJsonString = json_encode($settings);


    if(isset($_GET['smartdesk']) and $currentWifi<>""){
        file_put_contents("/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json", $newJsonString);
    }else{
        file_put_contents("/home/".$user."/.ZED/SETTINGS.json", $newJsonString);
    }
?>