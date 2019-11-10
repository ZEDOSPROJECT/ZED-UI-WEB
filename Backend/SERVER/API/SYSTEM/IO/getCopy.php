<?php
    header("Access-Control-Allow-Origin: *");
    if(file_exists("../../../STATUS/COPY/".$_GET['uuid'])){
        echo(file_get_contents("../../../STATUS/COPY/".$_GET['uuid']));
    }else{
        echo("FINISHED");
    }
?>