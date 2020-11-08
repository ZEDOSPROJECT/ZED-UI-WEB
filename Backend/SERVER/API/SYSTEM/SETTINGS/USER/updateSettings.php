<!-- This script sync the user settings from a template to prevent data loss and/or data reset in user settings
when added or removed settings from ZED -->

<?php
    if(file_exists("./SETTINGS.json")){
        $template = json_decode(file_get_contents("./templateSettings.json"), true);
        $userSettings = json_decode(file_get_contents("./SETTINGS.json"), true);
    
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
        file_put_contents('SETTINGS.json', json_encode($userSettings));
    }else{
        copy("./templateSettings.json","./SETTINGS.json");
    }
?>