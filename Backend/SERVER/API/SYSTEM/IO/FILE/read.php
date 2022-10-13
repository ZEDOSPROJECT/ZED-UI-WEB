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
		header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
		header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
	
		if(file_exists($file)){
			readfile($file);
		}else{
			header('HTTP/1.1 404 Unauthorized', true, 404);
		}
	}
?>
