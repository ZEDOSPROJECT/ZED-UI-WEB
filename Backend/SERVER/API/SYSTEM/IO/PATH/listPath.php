<?php
    header("Access-Control-Allow-Origin: *");
    $PATH=$_GET['path'];
    $RESPONSE='{ "data" :[';
    $i=0;
	foreach (sort_dir_files($PATH) as $value) {
        if( $value != "." and $value != ".." and substr( $value , 0, 1) != "."){
            if(is_dir($PATH.$value) == 1) {
                $TYPE = 'folder';
            } else {
                $TYPE = "file";
            } 
            $RESPONSE = $RESPONSE.'{ "name": "'.$value.'", "type": "'.$TYPE.'"},';
            $i=$i+1;
        } 
    }
    if($i==0){
        echo json_encode('{ "data":[]}  '); 
    } 
    else
    {
        $RESPONSE = substr( $RESPONSE , 0, -1)."]}"; 
        echo json_encode($RESPONSE); 
    } 

    function sort_dir_files($dir)
    {
            $sortedData = array();
            foreach(scandir($dir) as $file)
            {
                    if(is_file($dir.'/'.$file))
                            array_push($sortedData, $file);
                    else
                            array_unshift($sortedData, $file);
            }
            return $sortedData;
    }
    
?>