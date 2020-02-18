<?php
    header("Access-Control-Allow-Origin: *");
    $data['username'] = shell_exec("whoami");
    $data['documents'] = "/home/".$data['username']."/Documents/";
    $data['music'] = "/home/".$data['username']."/Music/";
    $data['picture'] = "/home/".$data['username']."/Pictures/";
    $data['videos'] = "/home/".$data['username']."/Videos/";
    $data['downloads'] = "/home/".$data['username']."/Downloads/";
    echo json_encode($data);
?>