<?php
    $entityBody = file_get_contents('php://input');
    header("Access-Control-Allow-Origin: *");
    $file = $_GET['path'];
    file_put_contents($file, $entityBody);
?>