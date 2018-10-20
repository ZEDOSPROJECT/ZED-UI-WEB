<!DOCTYPE html>
<html lang="en" >

	<HEAD>
		<TITLE>Settings</TITLE>
	</HEAD>
	<BODY>
		<form method="post" action="/API/SYSTEM/SETTINGS/USER/setSettings.php">
			<h2>Personalization:</h2>
			<p>Wallpaper URL: <input type="text" name="setting_wallpaperURL" id="setting_wallpaperURL" value="wallpaper.jpg"/></p>
			<p>Bing Wallpaper: <input type="checkbox" name="setting_bingWallpaper" id="setting_bingWallpaper"/></p>
			<p>Background color: <input type="color" name="setting_wallpaperColor" id="setting_wallpaperColor" value="#004e98"></p>
			<br>
			<hr>
			<button type="reset">DEFAULTS</button>
			<button type="submit">SAVE</button>
		</form>
	</BODY>

</html>
