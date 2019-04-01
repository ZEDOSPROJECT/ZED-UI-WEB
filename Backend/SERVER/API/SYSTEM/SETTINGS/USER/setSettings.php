<?php
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));
    
    file_put_contents('SETTINGS.json', $content);
?>

<script>
    window.history.back();
</script>
