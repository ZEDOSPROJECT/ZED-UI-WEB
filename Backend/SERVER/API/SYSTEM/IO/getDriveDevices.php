<?php
    header("Access-Control-Allow-Origin: *");
    $DEVICES=[];
    $decode = json_decode( shell_exec('lsblk -O -J'), TRUE );
    $SUPPORTED_TYPE=["ntfs","ext2","ext3","ext4"];
    $used=[];

    foreach ( $decode["blockdevices"] as $valor){
        foreach ( $valor["children"] as $obj){
            if(in_array($obj["fstype"], $SUPPORTED_TYPE)){
                shell_exec('udisksctl mount -b '.$obj["path"]);
            }
        }
    }

    foreach ( $decode["blockdevices"] as $valor){
        foreach ( $valor["children"] as $obj){
            if(in_array($obj["fstype"], $SUPPORTED_TYPE)){
                $tmp_obj=[];
                $tmp_obj["mountpoint"]=$obj["mountpoint"];
                $tmp_obj["name"]=$obj["partlabel"];
                $tmp_obj["fsuse"]=preg_replace('/[^0-9]/', '', $obj["fsuse%"]);
                $tmp_obj["fstype"]=$obj["fstype"];
                $tmp_obj["type"]="hdd";
                if($obj["mountpoint"] === "/"){
                    $tmp_obj["name"]="File System"; 
                }
                if(!in_array($tmp_obj["name"], $used)){
                    array_push($DEVICES,$tmp_obj);
                    array_push($used,$tmp_obj["name"]);
                }
            }
        }
    }
    
    echo json_encode($DEVICES);
?>