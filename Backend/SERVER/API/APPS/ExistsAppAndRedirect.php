<?php

    header("Access-Control-Allow-Origin: *");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    if(folder_exist("../../APPS/".$_GET['appName'])){
        header("Location: http://zed-os.sourceforge.net/store/showApp.php?APPNAME=".$_GET['appName']."&isInstalled=1");
        die();
    }else{
        header("Location: http://zed-os.sourceforge.net/store/showApp.php?APPNAME=".$_GET['appName']);
        die();
    }
    function folder_exist($folder)
    {
        // Get canonicalized absolute pathname
        $path = realpath($folder);

        // If it exist, check if it's a directory
        if($path !== false AND is_dir($path))
        {
            // Return canonicalized absolute pathname
            return $path;
        }

        // Path/folder does not exist
        return false;
    }
?>