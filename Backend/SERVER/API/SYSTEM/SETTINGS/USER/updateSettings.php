<!-- This script sync the user settings from a template to prevent data loss and/or data reset in user settings
when added or removed settings from ZED -->

<?php
    $user=exec("whoami");

    $configsFile=listFolderFiles("/home/".$user."/.ZED/smartDesktop/");
    array_push($configsFile,"/home/".$user."/.ZED/SETTINGS.json");
    
    function listFolderFiles($dir){
        $finalList=[];
        foreach (scandir($dir) as $value) {
            if($value<>"." and $value<>".." and $value<>".noData"){
                array_push($finalList,$dir.$value);
            }
        }
        return $finalList;
    }

    function sync($path,$user){
        echo("Syncing: ".$path."\n");
        if(file_exists($path)){
            $template = json_decode(file_get_contents("./templateSettings.json"), true);
            $userSettings = json_decode(file_get_contents($path), true);
        
            $unSyncKeysAdd=[];
            $unSyncKeysUseless=[];
        
            // Search for keys inexistent in user settings
            foreach ($template as $key => $value) {
                $found=false;
                foreach (array_keys($userSettings) as $keyU) {
                    if($key===$keyU){
                        $found=true;
                    }
                }
                if(!$found){
                    $unSyncKeysAdd[$key] = $value;
                }
            }
            /////////////////////////////////////////////
        
            // Search for useless keys in user settings
            foreach ($userSettings as $key => $value) {
                $found=false;
                foreach (array_keys($template) as $keyU) {
                    if($key===$keyU){
                        $found = true;
                    }
                }
                if(!$found){
                    $unSyncKeysUseless[$key] = $value;
                }
            }
            /////////////////////////////////////////////
        
            // Clean useless keys in user settings
            foreach (array_keys($unSyncKeysUseless) as $key) {
                unset($userSettings[$key]); 
            }
            /////////////////////////////////////////////
        
            // Add unSync inexistent keys in user settings but found in template
            foreach ($unSyncKeysAdd as $key => $value) {
                $userSettings[$key] = $value;
            }
            //////////////////////////////////////////////////////////////////////////////////////////
            
        
            // Save new user settings updated   
            file_put_contents($path, json_encode($userSettings));
        }else{
            copy("./templateSettings.json",$path);
        }
    }

    foreach ($configsFile as $value) {
        sync($value,$user);
    }
?>