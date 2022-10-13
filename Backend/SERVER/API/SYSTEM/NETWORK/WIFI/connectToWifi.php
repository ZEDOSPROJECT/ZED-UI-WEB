<?php
    header("Access-Control-Allow-Origin: *");
    $ssid=$_GET["ssid"];
    $password=$_GET["password"];
    shell_exec('nmcli device wifi connect '.$ssid.' password "'.$password.'"');
?>