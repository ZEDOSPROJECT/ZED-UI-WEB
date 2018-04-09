<?php
    echo json_encode(scandir($_GET["path"]));
?>