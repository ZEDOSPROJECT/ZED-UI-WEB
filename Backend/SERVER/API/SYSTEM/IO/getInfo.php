<?php
    header("Access-Control-Allow-Origin: *");

    $path = $_GET['path'];
    $response = [
    "MIME" => mime_content_type($path),
    "SIZE" => formatBytes(filesize($path)),
    "LAST_DATE" => date("F d Y H:i:s.", filemtime($path)),
    ];

    echo json_encode($response);

    function formatBytes($bytes, $decimals = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];

    for ($i = 0; $bytes > 1024; $i++) {
        $bytes /= 1024;
    }

    return number_format($bytes, $decimals) . ' ' . $units[$i];
    }
?>