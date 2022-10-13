<?php
    header("Access-Control-Allow-Origin: *");
    $file = $_GET['path'];

    function rrmdir($dir) { 
        if (is_dir($dir)) { 
          $objects = scandir($dir); 
          foreach ($objects as $object) { 
            if ($object != "." && $object != "..") { 
              if (is_dir($dir."/".$object) && !is_link($dir."/".$object))
                rrmdir($dir."/".$object);
              else
                unlink($dir."/".$object); 
            } 
          }
          rmdir($dir); 
        } 
      }


    if(is_dir($file)){
        rrmdir($file);
    }else{
        unlink($file);
    }
?>