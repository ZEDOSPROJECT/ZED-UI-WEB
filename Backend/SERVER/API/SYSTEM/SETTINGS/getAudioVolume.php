<?php
    header("Access-Control-Allow-Origin: *");
    echo shell_exec("amixer get Master | awk '$0~/%/{print $4}' | tr -d '[]%'");
?>