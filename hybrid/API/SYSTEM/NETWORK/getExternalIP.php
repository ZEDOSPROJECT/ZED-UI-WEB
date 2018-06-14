<?php
    $realIP = file_get_contents("http://ipecho.net/plain");
	echo $realIP;
?>