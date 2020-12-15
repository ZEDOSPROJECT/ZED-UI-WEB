<?php
    header("Access-Control-Allow-Origin: *");
    $url = $_GET['url']; 
    $user=exec("whoami");
    $settings = json_decode(file_get_contents("/home/".$user."/.ZED/SETTINGS.json"),true);
    $settings['setting_wallpaperURL']="Online.jpg";
    $newJsonString = json_encode($settings);
    file_put_contents("/home/".$user."/.ZED/SETTINGS.json", $newJsonString);
    file_put_contents( $_SERVER['DOCUMENT_ROOT']."/Wallpapers/Images/Online.jpg", fopen($url, 'r'));
?>