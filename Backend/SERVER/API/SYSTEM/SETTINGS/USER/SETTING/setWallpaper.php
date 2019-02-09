<?php
    header("Access-Control-Allow-Origin: *");
    copy($_GET['path'] , "../../../../../Wallpapers/".basename($_GET['path']));
    $settings = json_decode(file_get_contents('../SETTINGS.json'),true);
    $settings['setting_wallpaperURL']=basename($_GET['path']);
    $newJsonString = json_encode($settings);
    file_put_contents('../SETTINGS.json', $newJsonString);
?>