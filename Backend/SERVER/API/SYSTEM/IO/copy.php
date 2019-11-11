<?php
    ini_set('max_execution_time', 0); 
    header("Access-Control-Allow-Origin: *");

    function copyFolder($from,$to,$uuid){
        $source = $from;
        $dest= $to;
        $objects = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($from),
            RecursiveIteratorIterator::SELF_FIRST
        );
        $maxCount=iterator_count($objects);
        $currentCount=0;

        mkdir($dest, 0755);
        foreach (
            $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST) as $item
        ) {
            if ($item->isDir()) {
                mkdir($dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName());
            } else {
                copy($item, $dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName());
            }
            $currentCount=$currentCount+1;
            echo($item);
            $progress = min(100, 100 * $currentCount / $maxCount);
            file_put_contents("../../../STATUS/COPY/".$uuid, basename($item)."|".round($progress));
        }
    }

    function copyFile($from,$to,$uuid){
        $remote = fopen($from, 'rb');
        $local = fopen($to, 'wb');
        $read_bytes = 0;
        while(!feof($remote)) {
            $buffer = fread($remote, 2048);
            fwrite($local, $buffer);
            $read_bytes += 2048;
            $progress = min(100, 100 * $read_bytes / filesize($from));
            file_put_contents("../../../STATUS/COPY/".$uuid, basename($from)."|".round($progress));
        }
        fclose($remote);
        fclose($local);
    }

    if(is_dir($_GET['from'])){
        copyFolder($_GET['from'],$_GET['to'],$_GET['uuid']);
    }else{
        copyFile($_GET['from'],$_GET['to'],$_GET['uuid']);
    }

    unlink("../../../STATUS/COPY/".$_GET['uuid']);
?>