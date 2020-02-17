<?php
    header("Access-Control-Allow-Origin: *");
    $username = $_GET['username'];
    $password = $_GET['password'];
    shell_exec('echo "zed" | sudo -S usermod -m -d /home/'.$username.' zed');
    shell_exec('echo "zed" | sudo -S echo "'.$password.'" | passwd --stdin zed');
    shell_exec('echo "'.$password.'" | sudo -S usermod --login '.$username.' zed');
    shell_exec('echo "'.$password.'" | sudo -S reboot');
?>