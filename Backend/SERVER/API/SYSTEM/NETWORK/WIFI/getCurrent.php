<?php
    header("Access-Control-Allow-Origin: *");
    echo(exec("iwgetid -r"));
?>