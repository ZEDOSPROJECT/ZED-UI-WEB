<?php
    //Receive the RAW post data.
    $user=exec("whoami");
    $content = trim(file_get_contents("php://input"));
    
    file_put_contents("/home/".$user."/.ZED/SETTINGS.json", $content);
?>

<script>
    window.history.back();
</script>
