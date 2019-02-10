<?php
    header("Access-Control-Allow-Origin: *");
    $path_info = pathinfo($_GET['path']);
    $finalFile = uniqid()."_EXTERNAL.".$path_info['extension'];
   
    foreach (scandir($_SERVER['DOCUMENT_ROOT']."/Wallpapers/") as $filename) {
        if (strpos($filename, '_EXTERNAL.') !== false) {
            unlink($_SERVER['DOCUMENT_ROOT']."/Wallpapers/".$filename);
        }
    }
    copy($_GET['path'] , $_SERVER['DOCUMENT_ROOT']."/Wallpapers/".$finalFile);
    $settings = json_decode(file_get_contents('../SETTINGS.json'),true);
    $settings['setting_wallpaperURL']=$finalFile;
    $newJsonString = json_encode($settings);
    file_put_contents('../SETTINGS.json', $newJsonString);
?>