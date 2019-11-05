<?php
    header("Access-Control-Allow-Origin: *");
    $PATH=$_GET['path'];
    $NEW_NAME=$_GET['new_name'];
    $NEW_PATH=dirname($PATH)."/".$NEW_NAME;
    rename($PATH, $NEW_PATH);
    echo(1);
?>