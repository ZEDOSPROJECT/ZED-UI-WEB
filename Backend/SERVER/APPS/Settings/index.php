<!DOCTYPE html>
<html lang="en" >

	<HEAD>
		<TITLE>Settings</TITLE>
	</HEAD>
	<BODY>
		<form id="settings" method="post" action="/API/SYSTEM/SETTINGS/USER/setSettings.php">
			<h2>Personalization:</h2>
			<p>Wallpaper URL: <input type="text" name="setting_wallpaperURL" id="setting_wallpaperURL" value="wallpaper.jpg"/></p>
			<p>Bing Wallpaper: <input type="checkbox" name="setting_bingWallpaper" id="setting_bingWallpaper"/></p>
			<p>Background color: <input type="color" name="setting_wallpaperColor" id="setting_wallpaperColor" value="#004e98"></p>
			<p>System color: <input type="color" name="setting_systemColor" id="setting_systemColor" value="#004e98"></p>
			<br>
			<hr>
			<h2>Display Settings</h2>
			<p>Resolution:
				<select name="setting_resolution" id="setting_resolution">
					<option value="150%">150%</option>
					<option selected="selected" value="100%">100%</option>
					<option value="90%">90%</option>
					<option value="80%">80%</option>
				</select>
			</p>
			<br>
			<hr>
			<button type="reset">DEFAULTS</button>
			<button type="submit">SAVE</button>
		</form>
	</BODY>
</html>
