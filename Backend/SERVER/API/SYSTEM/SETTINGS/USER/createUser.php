<?php
    header("Access-Control-Allow-Origin: *");
    $pwd = $_GET['pwd'];
    $username = $_GET['username'];
    $password = $_GET['password'];
    shell_exec('echo "'.$pwd.'" | sudo -S useradd -m '.$username.' -p '.$password.'');
?>