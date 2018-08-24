<?php
    header("Access-Control-Allow-Origin: *");
    echo json_encode(scandir($_SERVER["DOCUMENT_ROOT"]."/APPS"));
?>
