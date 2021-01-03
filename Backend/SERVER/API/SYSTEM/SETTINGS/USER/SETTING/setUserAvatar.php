<?php
	header("Access-Control-Allow-Origin: *");
	$file = $_GET['file'];
	$user=exec("whoami");
	copy($_SERVER['DOCUMENT_ROOT']."/API/SYSTEM/SETTINGS/USER/AVATARS/".$file,"/home/".$user."/.face");
?>
