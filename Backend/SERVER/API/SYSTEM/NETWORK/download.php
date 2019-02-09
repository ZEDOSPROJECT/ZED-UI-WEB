<?php
    $from = $_GET['from']; 
    $to = $_GET['to']; 
    file_put_contents($to, fopen($from, 'r'));
?>