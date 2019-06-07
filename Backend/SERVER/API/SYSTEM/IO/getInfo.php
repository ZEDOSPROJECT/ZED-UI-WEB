<?php
    header("Access-Control-Allow-Origin: *");
    $PATH=$_GET['path'];
    $RESPONSE["MIME"]=mime_content_type($PATH);
    $RESPONSE["SIZE"]=human_filesize(filesize($PATH));
    $RESPONSE["LASTE_DATE"]=date ("F d Y H:i:s.", filemtime($PATH));
    echo json_encode($RESPONSE); 


    function human_filesize($bytes, $decimals = 2) {
        $size = array('B','kB','MB','GB','TB','PB','EB','ZB','YB');
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$size[$factor];
    }
?>