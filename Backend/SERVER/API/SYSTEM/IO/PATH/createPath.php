<?php

    header("Access-Control-Allow-Origin: *");
    $path=$_GET["path"];
    echo(mkdir($path));
    
?>