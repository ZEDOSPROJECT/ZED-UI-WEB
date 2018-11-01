<!DOCTYPE html>
<html lang="en" >

	<HEAD>
		<TITLE>Settings</TITLE>
		<script>
			function save(){
				document.getElementById("settings").submit();
			}

			function changeCurrentWallpaper(){
				document.getElementById("setting_wallpaperURL").value=document.getElementById("currentSelectedWallpaper").value;
			} 
		</script>
	</HEAD>
	<BODY>
		<form id="settings" method="post" action="/API/SYSTEM/SETTINGS/USER/setSettings.php">
			<h2>Personalization:</h2>
			<p>Wallpaper: 
			<select onChange="save()"
				name="setting_wallpaperURL"
				id="setting_wallpaperURL"
				>
				<option value="">Without Wallpaper</option>
				<?php
					foreach (scandir($_SERVER['DOCUMENT_ROOT'].'/Wallpapers') as $value) {
						if($value!="." && $value!=".."){
							echo '<option value="'.$value.'">'.$value.'</option>';
						} 
					}
				?>
			</select></p>
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
	</BODY>
</html>
