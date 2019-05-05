<?php
    header("Access-Control-Allow-Origin: *");
    readfile($_SERVER['DOCUMENT_ROOT']."/Wallpapers/Images/".$_GET['file']);
?>