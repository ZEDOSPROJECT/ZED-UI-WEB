<?php
	header("Access-Control-Allow-Origin: *");
	$file = $_GET['path'];
	
	if(!file_exists($file)){ // file does not exist
		die();
	} else {
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-Disposition: attachment; filename=".basename($_GET['path']));
		header("Content-Type: ".mime_content_type($_GET['path']));
		header("Content-Transfer-Encoding: binary");
	
		// read the file from disk
		readfile($file);
	}
?>
