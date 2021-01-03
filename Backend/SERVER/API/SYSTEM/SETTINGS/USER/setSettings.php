<?php
    //Receive the RAW post data.
    $user=exec("whoami");
    $content = trim(file_get_contents("php://input"));
    $currentWifi=exec("iwgetid -r");
    $_GET['smartdesk']=0; // ONLY FOR TESTING FORCE
    if(isset($_GET['smartdesk']) and $currentWifi<>""){
        file_put_contents("/home/".$user."/.ZED/smartDesktop/".$currentWifi.".json", $content);
    }else{
        file_put_contents("/home/".$user."/.ZED/SETTINGS.json", $content);
    }
?>

<script>
    window.history.back();
</script>
