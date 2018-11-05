<!DOCTYPE html>
<html lang="en" >

	<HEAD>
		<TITLE>Settings</TITLE>
		<script>
			function save(){
				document.getElementById("settings").submit();
			}

			function ChangeWallpaper(img){
				document.getElementById("setting_wallpaperURL").value=img;
				save();
			} 
		</script>
	</HEAD>
	<BODY>
		<form id="settings" method="post" action="/API/SYSTEM/SETTINGS/USER/setSettings.php">
			<h2>Personalization:</h2>
			<p>Wallpaper: 
			<input hidden type="text" name="setting_wallpaperURL" id="setting_wallpaperURL">
			<div>
				<div style="width:120px;height:80px;background-color:#004e98;float:left;" onClick="ChangeWallpaper('')"></div>
				<?php
					foreach (scandir($_SERVER['DOCUMENT_ROOT'].'/Wallpapers') as $value) {
						if($value!="." && $value!=".."){
							echo '<img onClick="ChangeWallpaper(\''.$value.'\')" width="120" height="80" src="../../Wallpapers/'.$value.'"></img>';
						} 
					}
				?>
			</div></p>
			<p>Bing Wallpaper: <input onChange="save()" type="checkbox" name="setting_bingWallpaper" id="setting_bingWallpaper"/></p>
			<p>Background color: <input onChange="save()" type="color" name="setting_wallpaperColor" id="setting_wallpaperColor" value="#004e98"></p>
			<p>System color: <input onChange="save()" type="color" name="setting_systemColor" id="setting_systemColor" value="#004e98"></p>
			<br>
			<hr>
			<h2>Display Settings</h2>
			<p>Resolution:
				<select onChange="save()" name="setting_resolution" id="setting_resolution">
					<option value="150%">150%</option>
					<option selected="selected" value="100%">100%</option>
					<option value="90%">90%</option>
					<option value="80%">80%</option>
				</select>
			</p>
			<br>
			<hr>
		</form>
		<script>
			function load(){  
				<?php
					$string=file_get_contents($_SERVER['DOCUMENT_ROOT']."/API/SYSTEM/SETTINGS/USER/SETTINGS.json");
					$json_a = json_decode($string, true);
					$bing=false;
					if($json_a["setting_bingWallpaper"]!=""){
						$bing=true;
					}
					echo 'document.getElementById("setting_wallpaperURL").value="'.$json_a["setting_wallpaperURL"].'";\n';
					echo 'document.getElementById("setting_bingWallpaper").checked="false";\n';
					echo 'document.getElementById("setting_wallpaperColor").value="'.$json_a["setting_wallpaperColor"].'";\n';
					echo 'document.getElementById("setting_systemColor").value="'.$json_a["setting_systemColor"].'";\n';
				?>
			}
			load();
		</script>
	</BODY>
</html>
