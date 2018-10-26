<?php
    header("Access-Control-Allow-Origin: *");
	$UA=$_SERVER['HTTP_USER_AGENT'];
    echo json_encode(scandir($_SERVER["DOCUMENT_ROOT"]."/APPS"));
?>
