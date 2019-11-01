<?php
    $path='';
    $first=TRUE;
    $found=FALSE;
    foreach (explode('/',getcwd()) as $value) {
        if(!$found){
            if($value=="Backend"){
                $found=TRUE;
            }else{
                if($first){
                    $path=$path.$value;
                    $first=FALSE;
                }else{
                    $path=$path."/".$value;
                }
            }
        }
    }

    $stringfromfile = file($path.'/.git/HEAD', FILE_USE_INCLUDE_PATH);
    $firstLine = $stringfromfile[0];
    $explodedstring = explode("/", $firstLine, 3);
    $branchname = $explodedstring[2];
    echo($branchname);
?>