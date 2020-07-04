<?php
    header("Access-Control-Allow-Origin: *");
    $file = $_GET['path'];

    $tmpOwner=posix_getpwuid(fileowner($filename));
    $path_info = pathinfo($file);

    $RESPONSE["fileName"]=basename($file);
    $RESPONSE["fileMIMEType"]=mime_content_type($file);
    $RESPONSE["fileSize"]=human_filesize(filesize($file));
    $RESPONSE["fileLastDate"]=date ("F d Y H:i:s.", filemtime($file));
    $RESPONSE["fileExtension"]=$path_info['extension'];
    $RESPONSE["fileOwner"]=$tmpOwner['name'];

    echo json_encode($RESPONSE); 

    function human_filesize($bytes, $decimals = 2) {
        $size = array('B','kB','MB','GB','TB','PB','EB','ZB','YB');
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$size[$factor];
    }
?>