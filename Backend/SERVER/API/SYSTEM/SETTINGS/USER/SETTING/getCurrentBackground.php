<?php
    header("Access-Control-Allow-Origin: *");
    readfile($_SERVER['DOCUMENT_ROOT']."/Wallpapers/".$_GET['file']);
?>