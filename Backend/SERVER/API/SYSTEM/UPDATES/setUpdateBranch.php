<?php
    header("Access-Control-Allow-Origin: *");
    $branch=$_GET["id"];
    $user=exec("whoami");
    file_put_contents("/home/".$user."/.ZED/.branch", $branch);
?>
