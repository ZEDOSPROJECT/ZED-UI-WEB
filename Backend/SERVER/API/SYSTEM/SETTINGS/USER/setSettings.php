<?php
    $data['setting_bingWallpaper'] = false;
    if($_POST['setting_bingWallpaper']){
        $data['setting_bingWallpaper'] = true;
    } 

    $data['setting_wallpaperURL'] = $_POST['setting_wallpaperURL'];
    $data['setting_wallpaperColor'] = $_POST['setting_wallpaperColor'];

    $newJsonString = json_encode($data);
    file_put_contents('SETTINGS.json', $newJsonString);
?>

<script>
    window.history.back();
</script>
