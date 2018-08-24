<?php
    header("Access-Control-Allow-Origin: *");
    $realIP = file_get_contents("http://ipecho.net/plain");
	echo $realIP;
?>