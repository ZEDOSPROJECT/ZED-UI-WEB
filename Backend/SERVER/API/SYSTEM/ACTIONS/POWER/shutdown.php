<?php
	header("Access-Control-Allow-Origin: *");
	$volume=shell_exec("amixer get Master | awk '$0~/%/{print $4}' | tr -d '[]%'");
	for ($i=$volume; $i > -10; $i-=1) { 
		shell_exec("amixer -D pulse set Master ".strval($i)."%");
		shell_exec("amixer set Master ".strval($i)."%");
		usleep(23000);
	}
	shell_exec('shutdown -h now');
?>