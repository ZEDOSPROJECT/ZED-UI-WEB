<?php
    header("Access-Control-Allow-Origin: *");
    $url = $_GET['url']; 
    $settings = json_decode(file_get_contents('../SETTINGS.json'),true);
    $settings['setting_wallpaperURL']="Online.jpg";
    $newJsonString = json_encode($settings);
    file_put_contents('../SETTINGS.json', $newJsonString);
    file_put_contents( __DIR__."/Wallpapers/Online.jpg", fopen($url, 'r'));
?>