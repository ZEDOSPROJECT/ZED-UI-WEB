<?php
    header("Access-Control-Allow-Origin: *");
    $user=exec("whoami");
    $data['username'] = $user;
    $data['documents'] = "/home/".$user."/Documents/";
    $data['music'] = "/home/".$user."/Music/";
    $data['picture'] = "/home/".$user."/Pictures/";
    $data['videos'] = "/home/".$user."/Videos/";
    $data['downloads'] = "/home/".$user."/Downloads/";
    echo json_encode($data);
?>