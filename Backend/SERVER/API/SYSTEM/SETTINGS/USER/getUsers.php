<?php
    header("Access-Control-Allow-Origin: *");
    $users = explode("\n", shell_exec("cut -d: -f1,3 /etc/passwd | egrep ':[0-9]{4}$' | cut -d: -f1"));

    $finalJSON='{"data":[';
    for ($i=0; $i <= count($users)-2; $i++) { 
        $finalLine='{"userName":"'.$users[$i].'"}';
        $finalJSON=$finalJSON.$finalLine;
    }
    $finalJSON=$finalJSON."]}";
    echo($finalJSON);
?>