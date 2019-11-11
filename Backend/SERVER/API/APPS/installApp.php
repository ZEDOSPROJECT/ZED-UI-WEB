<?php
    header("Access-Control-Allow-Origin: *");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $appName=$_GET['appName'];  
    $tempFileName=md5(uniqid("")).".tar.gz";
    file_put_contents("/tmp/".$tempFileName, fopen("http://zedserver.epizy.com/store/DIRECTORY/".$appName."/app.tar.gz", 'r'));
    mkdir("../../APPS/".$appName, 0700);
    $phar = new PharData("/tmp/".$tempFileName);
    $phar->extractTo("../../APPS/".$appName);

    file_put_contents("../../APPS/".$appName."/favicon.png", fopen("http://zedserver.epizy.com/store/DIRECTORY/".$appName."/favicon.png", 'r'));
    file_put_contents("../../APPS/".$appName."/app_manifest.json", fopen("http://zedserver.epizy.com/store/DIRECTORY/".$appName."/app_manifest.json", 'r'));
    unlink("/tmp/".$tempFileName);
    echo("done");
?>