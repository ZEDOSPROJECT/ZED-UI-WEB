<?php
        header("Access-Control-Allow-Origin: *");
        $username=substr_replace(shell_exec('whoami') ,"", -1);
        $file="/home/".$username."/.face";
        if(!file_exists($file)){ // file does not exist
            $file="User.jpg";
            header("Cache-Control: public");
            header("Content-Description: File Transfer");
            header("Content-Disposition: attachment; filename=".basename($file));
            header("Content-Type: ".mime_content_type($file));
            header("Content-Transfer-Encoding: binary");
            header ("Expires: 0");

            readfile($file);
        } else {
            header("Cache-Control: public");
            header("Content-Description: File Transfer");
            header("Content-Disposition: attachment; filename=".basename($file));
            header("Content-Type: ".mime_content_type($file));
            header("Content-Transfer-Encoding: binary");
            header ("Expires: 0");
        
            // read the file from disk
            readfile($file);
        }
?>