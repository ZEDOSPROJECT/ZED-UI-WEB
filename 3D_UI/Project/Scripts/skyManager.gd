extends Node

var night=true #FOR TESTING ONLY

func _ready():
	set_process(true);


func _process(delta):
	var timeDict = OS.get_time();
	var hour = timeDict.hour;
#	var BGSound = get_node("/root/World/BGSound/timeOfDay");
#	var stream
	if hour > 20 or hour < 5:
	#if night: #FOR TESTING ONLY
		get_node("/root/World/NightLights").visible=true
		get_node("/root/World/WorldEnvironment").set_environment(load("res://Skys/Night.tres"));
#		stream = load("res://Sounds/Night.ogg")
#		BGSound.set_stream(stream)
#		BGSound.volume_db = 1
#		BGSound.pitch_scale = 1
#		if not BGSound.playing:
#			BGSound.play()
	else:
		get_node("/root/World/NightLights").visible=false
		get_node("/root/World/WorldEnvironment").set_environment(load("res://Skys/Day.tres"));	
#		stream = load("res://Sounds/Day.ogg")
#		BGSound.set_stream(stream)
#		BGSound.volume_db = 1
#		BGSound.pitch_scale = 1
#		if not BGSound.playing:
#			BGSound.play()
		

