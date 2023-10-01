<?php
    header("Access-Control-Allow-Origin: *");
    $path = $_GET['path'];
    $filename = basename($path);
    $hash = sha1($path.$filename);
    $thumbnail_path = '/home/'.get_current_user().'/.ZED/thumbs/' . $hash . '.jpg';

    if (file_exists($thumbnail_path)) {
        header('Content-Type: image/jpeg');
        readfile($thumbnail_path);
    } else {
        header("HTTP/1.0 404 Not Found");
        echo "404";
    }
?>
