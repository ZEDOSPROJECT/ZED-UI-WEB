<?php
    header("Access-Control-Allow-Origin: *");
    echo shell_exec("amixer -D pulse get Master | awk -F 'Left:|[][]' 'BEGIN {RS=""}{ print $3 }'| tr -d '[]%'");
?>