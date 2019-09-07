<?php
    header("Access-Control-Allow-Origin: *");
    $inUse = explode("\n", shell_exec("nmcli -t -f IN-USE device wifi"));
    $ssids=explode("\n", shell_exec("nmcli -t -f SSID device wifi"));
    $signals=explode("\n", shell_exec("nmcli -t -f SIGNAL device wifi"));
    $securitys=explode("\n", shell_exec("nmcli -t -f SECURITY device wifi"));

    $wifiArraySize=count($ssids);
    $finalJSON="{";
    for ($i=0; $i <= $wifiArraySize-2; $i++) { 
        if($i==$wifiArraySize-2){
            $finalLine='"'.$i.'":{"inUse":"'.$inUse[$i].'","ssid":"'.$ssids[$i].'","signal":'.$signals[$i].',"security":"'.$securitys[$i].'"}';
        }else{
            $finalLine='"'.$i.'":{"inUse":"'.$inUse[$i].'","ssid":"'.$ssids[$i].'","signal":'.$signals[$i].',"security":"'.$securitys[$i].'"},';
        }
        $finalJSON=$finalJSON.$finalLine;
    }
    $finalJSON=$finalJSON."}";
    echo($finalJSON);
?>