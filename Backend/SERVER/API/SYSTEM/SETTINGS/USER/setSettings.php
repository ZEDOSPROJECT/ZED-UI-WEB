<?php
    $data['setting_bingWallpaper'] = false;
    if($_POST['setting_bingWallpaper']){
        $data['setting_bingWallpaper'] = true;
    } 

    $data['setting_wallpaperURL']   = $_POST['setting_wallpaperURL'];
    $data['setting_wallpaperColor'] = $_POST['setting_wallpaperColor'];
    $data['setting_resolution']     = $_POST['setting_resolution'];
    $data['setting_systemColor0']   = $_POST['setting_systemColor0'];
    $data['setting_systemColor1']   = $_POST['setting_systemColor1'];
    $data['setting_gradientEffect']  = $_POST['setting_gradientEffect'];
    $data['setting_autoGradient']  = $_POST['setting_autoGradient'];
    $data['setting_blueFilter']  = $_POST['setting_blueFilter'];

    $newJsonString = json_encode($data);
    file_put_contents('SETTINGS.json', $newJsonString);
?>

<script>
    window.history.back();
</script>
