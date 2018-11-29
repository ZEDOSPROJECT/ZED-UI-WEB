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

			function componentToHex(c) {
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			}
			
			function rgbToHex(r, g, b) {
				return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
			}

			function getGradient(){
				var img = new Image;
				img.onload = function(){
					var myCanvas = document.createElement('canvas');
					myCanvas.width = img.width;
					myCanvas.height = img.height;
					var ctx = myCanvas.getContext('2d');
					ctx.drawImage(img,0,0,img.width,img.height); // Or at whatever offset you like
					const colorTOP=myCanvas.getContext('2d').getImageData(img.width/2, 20, 1, 1).data;
					const colorBOTTOM=myCanvas.getContext('2d').getImageData(img.width/2,img.height-40, 1, 1).data;
					const finalColorTOP=rgbToHex(colorTOP[0],colorTOP[1],colorTOP[2]);
					const finalColorBOTTOM=rgbToHex(colorBOTTOM[0],colorBOTTOM[1],colorBOTTOM[2]);
					if(document.getElementById("setting_autoGradient").checked && document.getElementById("setting_systemColor1").value !== finalColorTOP && document.getElementById("setting_systemColor0").value !== finalColorBOTTOM){
						document.getElementById("setting_systemColor1").value = finalColorTOP;
						document.getElementById("setting_systemColor0").value = finalColorBOTTOM;
						save();
					} 
				};
				img.src = "../../Wallpapers/"+document.getElementById("setting_wallpaperURL").value;;
			} 

			setInterval(() => {
				if(document.getElementById("setting_autoGradient").checked && document.getElementById("setting_gradientEffect").checked){
					getGradient();
				} 
			}, 1200);
		</script>
	</HEAD>
	<BODY>
		<form id="settings" method="post" action="/API/SYSTEM/SETTINGS/USER/setSettings.php">
			<h2>Personalization:</h2>
			<p>Wallpaper: 
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
			<?php
					$string=file_get_contents($_SERVER['DOCUMENT_ROOT']."/API/SYSTEM/SETTINGS/USER/SETTINGS.json");
					$json_a = json_decode($string, true);
					$bing="";
					$gradient="";
					$autoGradient="";
					if($json_a["setting_bingWallpaper"]){
						$bing="checked";
					}
					if($json_a["setting_gradientEffect"]){
						$gradient="checked";
					}
					if($json_a["setting_autoGradient"]){
						$autoGradient="checked";
					}
					echo '<br><br><input hidden type="text" name="setting_wallpaperURL" value="'.$json_a["setting_wallpaperURL"].'" id="setting_wallpaperURL">';
					echo '<p>Bing Wallpaper: <input onChange="save()" '.$bing.' type="checkbox" name="setting_bingWallpaper" id="setting_bingWallpaper"/></p>';
					echo '<p>Background color: <input onChange="save()" type="color" name="setting_wallpaperColor" id="setting_wallpaperColor" value="'.$json_a["setting_wallpaperColor"].'"></p></br>';
					echo '<p>System color top: <input onChange="save()" type="color" name="setting_systemColor1" id="setting_systemColor1" value="'.$json_a["setting_systemColor1"].'"></p>';
					echo '<p>System color bottom: <input onChange="save()" type="color" name="setting_systemColor0" id="setting_systemColor0" value="'.$json_a["setting_systemColor0"].'"></p>';
					echo '<p>Use Gradient Effect: <input onChange="save()" '.$gradient.' type="checkbox" name="setting_gradientEffect" id="setting_gradientEffect"/></p>';
					echo '<p>Use Gradient Effect by background: <input onChange="save()" '.$autoGradient.' type="checkbox" name="setting_autoGradient" id="setting_autoGradient"/></p>';
				?>
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
