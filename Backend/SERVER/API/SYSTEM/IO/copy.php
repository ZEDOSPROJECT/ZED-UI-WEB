<?php
    ini_set('max_execution_time', 0); 
    header("Access-Control-Allow-Origin: *");
    $uuid=$_GET['uuid'];
    $to=$_GET['to'];
    $from=$_GET['from'];
    $remote = fopen($from, 'rb');
    $local = fopen($to, 'wb');
    $read_bytes = 0;
    while(!feof($remote)) {
        $buffer = fread($remote, 2048);
        fwrite($local, $buffer);
        $read_bytes += 2048;
        $progress = min(100, 100 * $read_bytes / filesize($from));
        file_put_contents("../../../STATUS/COPY/".$_GET['uuid'], basename($from)."|".$progress);
    }
    fclose($remote);
    fclose($local);

    unlink("../../../STATUS/COPY/".$_GET['uuid']);
?>