<?php
    header("Access-Control-Allow-Origin: *");
    $realIP = file_get_contents("http://ifconfig.me/ip");
	echo $realIP;
?>