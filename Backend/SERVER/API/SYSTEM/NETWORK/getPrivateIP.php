<?php
    header("Access-Control-Allow-Origin: *");
    echo exec("ip addr | grep 'state UP' -A2 | tail -n1 | awk '{print $2}' | cut -f1  -d'/'");