<?php
	header("Access-Control-Allow-Origin: *");
	$PATH=$_GET['path'];
	echo file_get_contents($PATH);
?>
