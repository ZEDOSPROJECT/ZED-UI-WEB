<?php
    header("Access-Control-Allow-Origin: *");
    $bgs = array("");
    $user=exec("whoami");
    
    foreach (scandir($_SERVER['DOCUMENT_ROOT'].'/Wallpapers/Images') as $value) {
        if($value!="." && $value!=".."){
            array_push($bgs,$_SERVER['DOCUMENT_ROOT'].'/Wallpapers/Images/'.$value);
        } 
    }

    if(file_exists("/home/".$user."/.ZED/onlineImage.jpg")){
        array_push($bgs,"/home/".$user."/.ZED/onlineImage.jpg");
    }

    $OBJ["WALLPAPERS"] = $bgs;
    echo json_encode($OBJ);
?>