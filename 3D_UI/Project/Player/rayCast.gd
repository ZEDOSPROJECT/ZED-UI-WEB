extends Camera

func _ready():
	set_process_input(true)
	set_process(true)
	
func _process(delta):
	$"currentApp".margin_right=get_viewport().size.x
	$"currentApp".margin_top=get_viewport().size.y-100
	
	if $"/root/World/Player/UI/3DLOCK".visible == false:
		if $RayCast.is_colliding():
			var obj=$RayCast.get_collider();
			if(obj.name != "StaticBody" and obj.name != "Player"):
				$currentApp.text=obj.name
				$"currentApp".visible=true
			else:
				$currentApp.text=""
				$"currentApp".visible=false
	else:
		$currentApp.text=""
	
func _input( event ): 
	if $"/root/World/Player/UI/3DLOCK".visible == false:
		if( event.is_action_pressed("shoot") ):
			if $RayCast.is_colliding():
				var obj=$RayCast.get_collider();
				if(obj.name != "StaticBody" and obj.name != "Player"):
					$"/root/World/Player/UI/3DLOCK".visible=true;
					print("3DOPEN|"+obj.name)
