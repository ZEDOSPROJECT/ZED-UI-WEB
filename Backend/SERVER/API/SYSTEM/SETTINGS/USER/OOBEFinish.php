<?php
    header("Access-Control-Allow-Origin: *");
    $username = $_GET['username'];
    $password = $_GET['password'];
    shell_exec('echo "zed" | sudo -S ./OOBEFinish.sh '.$username.' '.$password);
?>