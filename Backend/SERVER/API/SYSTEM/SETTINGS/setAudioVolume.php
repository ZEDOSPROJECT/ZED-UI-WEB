amixer set Master 50%
<?php
    header("Access-Control-Allow-Origin: *");
    shell_exec("amixer -D pulse set Master ".$_GET['volume']."%");
?>