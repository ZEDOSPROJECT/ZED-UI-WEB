<?php
    header("Access-Control-Allow-Origin: *");
    $user=exec("whoami");
    $path_info = pathinfo($_GET['path']);
    $finalFile = uniqid()."_EXTERNAL.".$path_info['extension'];
   
    foreach (scandir($_SERVER['DOCUMENT_ROOT']."/Wallpapers/Images/") as $filename) {
        if (strpos($filename, '_EXTERNAL.') !== false) {
            unlink($_SERVER['DOCUMENT_ROOT']."/Wallpapers/Images/".$filename);
        }
    }
    copy($_GET['path'] , $_SERVER['DOCUMENT_ROOT']."/Wallpapers/Images/".$finalFile);
    $settings = json_decode(file_get_contents("/home/".$user."/.ZED/SETTINGS.json"),true);
    $settings['setting_wallpaperURL']=$finalFile;
    $newJsonString = json_encode($settings);
    file_put_contents("/home/".$user."/.ZED/SETTINGS.json", $newJsonString);
?>