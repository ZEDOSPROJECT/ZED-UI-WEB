<?php
    header("Access-Control-Allow-Origin: *");
    $FINAL_LIST=[];
    $UA=$_SERVER['HTTP_USER_AGENT'];
    foreach (scandir($_SERVER["DOCUMENT_ROOT"]."/APPS") as $app) {
        if($app != ".." and $app != "."){
            if($UA=="DESKTOP"){
                $content=file_get_contents($_SERVER["DOCUMENT_ROOT"]."/APPS/".$app."/PLATFORMS");
                if (strpos($content, "DESTOP") !== false) {
                    array_push($FINAL_LIST,$app);
                }
            }
            else
            {
                $content=file_get_contents($_SERVER["DOCUMENT_ROOT"]."/APPS/".$app."/PLATFORMS");
                if (strpos($content, "WEB") !== false) {
                    array_push($FINAL_LIST,$app);
                }
            } 
        } 
    }
    echo json_encode($FINAL_LIST);
?>
