<?php
    header("Access-Control-Allow-Origin: *");
    $FINAL_LIST=[];
    $UA=$_SERVER['HTTP_USER_AGENT'];
    $query="";  
    if(isset($_GET['query'])){
        $query=$_GET['query'];  
    } 
    foreach (scandir($_SERVER["DOCUMENT_ROOT"]."/APPS") as $app) {
        if($app != ".." and $app != "."){
            $content=file_get_contents($_SERVER["DOCUMENT_ROOT"]."/APPS/".$app."/PLATFORMS");
            if($UA=="DESKTOP"){
                if (strpos($content, "DESKTOP") !== false) {
                    if($query == ""){
                        array_push($FINAL_LIST,$app);
                    }else{
                        if (strpos(strtolower($app), strtolower($query)) !== false) {
                            array_push($FINAL_LIST,$app);
                        } 
                    } 
                }
            }
            else
            {
                if (strpos($content, "WEB") !== false) {
                    if($query == ""){
                        array_push($FINAL_LIST,$app);
                    }else{
                        if (strpos(strtolower($app), strtolower($query)) !== false) {
                            array_push($FINAL_LIST,$app);
                        } 
                    } 
                }
            } 
        } 
    }
    echo json_encode($FINAL_LIST);
?>
