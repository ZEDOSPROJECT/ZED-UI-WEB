<?php
    header("Access-Control-Allow-Origin: *");
    $query=$_GET['query'];
    $PATH=$_GET['path'];
    $result=shell_exec('find '.$PATH.' -name "'.$query.'*" 2>&1 | grep -v "find:"');
    $result_R=explode("\n",$result);
    $RESPONSE='{ "data" :[';
    $i=0;
    foreach ($result_R as $key => $value) {

        $temp = explode('/', $value);

        unset($temp[count($temp) - 1]);

        $filePath=implode('/', $temp)."/";

        if(is_dir($PATH.$value) == 1) {
            $TYPE = 'folder';
        } else {
            $TYPE = "file";
        } 
        if($TYPE=="file"){
            $RESPONSE = $RESPONSE.'{ "name": "'.basename($value).'", "type": "'.$TYPE.'", "path": "'.$filePath.'"},';
            $i=$i+1;
        }
    }
    if($i==0){
        echo json_encode('{ "data":[]}  '); 
    }else{
        $RESPONSE = substr( $RESPONSE , 0, -1)."]}"; 
        echo json_encode($RESPONSE); 
    } 
?>