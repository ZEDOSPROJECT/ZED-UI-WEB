<?php
    header("Access-Control-Allow-Origin: *");
    $PATH=$_GET['path'];
	$RESPONSE='{ "data" :[';
	foreach (scandir($PATH) as $value) {
        if( $value != "." and $value != ".." and substr( $value , 0, 1) != "."){
            if(is_dir($PATH.$value) == 1) {
                $TYPE = 'folder';
            } else {
                $TYPE = "file";
            } 
            $RESPONSE = $RESPONSE.'{ "name": "'.$value.'", "type": "'.$TYPE.'"},';
        } 
    }
    $RESPONSE = substr( $RESPONSE , 0, -1)."]}";
    echo json_encode($RESPONSE);
?>