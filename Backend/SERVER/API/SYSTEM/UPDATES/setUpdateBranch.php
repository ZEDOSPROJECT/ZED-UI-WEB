<?php
    header("Access-Control-Allow-Origin: *");
    $branch=$_GET["id"];
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
    echo($path);
    putenv('PATH='.$path);
    shell_exec('git checkout '.$branch);
?>