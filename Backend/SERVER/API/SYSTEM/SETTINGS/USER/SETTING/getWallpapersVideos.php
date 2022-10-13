<?php
    header("Access-Control-Allow-Origin: *");
    $bgs = array("");

    foreach (scandir($_SERVER['DOCUMENT_ROOT'].'/Wallpapers/Videos') as $value) {
        if($value!="." && $value!=".."){
            array_push($bgs,$value);
        } 
    }

    $OBJ["WALLPAPERS"] = $bgs;
    echo json_encode($OBJ);
?>