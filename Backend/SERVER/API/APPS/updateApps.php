<?php
    header("Pragma: no-cache");
    
    $APPS=scandir("../../APPS/");
    foreach ($APPS as $appName) {
        if($appName!=".." and $appName!="."){
            $tempFileName=md5(uniqid("")).".tar.gz";
            file_put_contents("/tmp/".$tempFileName, fopen("http://zed-os.sourceforge.net/store/DIRECTORY/".$appName."/app.tar.gz", 'r'));
            try {
                $phar = new PharData("/tmp/".$tempFileName);
                $phar->extractTo("../../APPS/".$appName,null,true);
    
                file_put_contents("../../APPS/".$appName."/favicon.png", fopen("http://zed-os.sourceforge.net/store/DIRECTORY/".$appName."/favicon.png", 'r'));
                file_put_contents("../../APPS/".$appName."/app_manifest.json", fopen("http://zed-os.sourceforge.net/store/DIRECTORY/".$appName."/app_manifest.json", 'r'));
                unlink("/tmp/".$tempFileName);
            } catch (\Throwable $th) {}
        }
    }
    echo("done");
?>