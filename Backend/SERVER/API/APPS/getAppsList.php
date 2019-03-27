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
            $content=file_get_contents($_SERVER["DOCUMENT_ROOT"]."/APPS/".$app."/manifest.json");
            if($content !== "INVISIBLE"){
                $FIANL_OBJ['Name']=$app;
                $FIANL_OBJ['manifest']=json_decode($content,true);
                if($query == ""){
                    array_push($FINAL_LIST,$FIANL_OBJ);
                }else{
                    if (strpos(strtolower($app), strtolower($query)) !== false) {
                        array_push($FINAL_LIST,$FIANL_OBJ);
                    } 
                } 
            } 
        } 
    }
    echo json_encode($FINAL_LIST);
?>
