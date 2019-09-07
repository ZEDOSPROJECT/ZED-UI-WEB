<?php
    header("Access-Control-Allow-Origin: *");
    $ssid=$_GET["ssid"];
    echo(shell_exec('nmcli con down id '.$ssid));
?>