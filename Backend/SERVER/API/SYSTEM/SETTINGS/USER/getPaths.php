<?php
    header("Access-Control-Allow-Origin: *");
    $data['username'] = get_current_user();
    $data['documents'] = "/home/".get_current_user()."/Documents/";
    $data['music'] = "/home/".get_current_user()."/Music/";
    $data['picture'] = "/home/".get_current_user()."/Pictures/";
    $data['videos'] = "/home/".get_current_user()."/Videos/";
    $data['downloads'] = "/home/".get_current_user()."/Downloads/";
    echo json_encode($data);
?>