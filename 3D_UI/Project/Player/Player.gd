extends KinematicBody

export var speed = 10
export var acceleration = 5
export var gravity = 0.98
export var jump_power = 30
export var mouse_sensitivity = 0.3

onready var head = $Head
onready var camera = $Head/Camera

var velocity = Vector3()
var camera_x_rotation = 0
var isLocked = false

const ray_length = 1000

func _ready():
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	set_process(true)
	
func _process(delta):
	if $"UI/3DLOCK".visible == true:
		$UI/Label.text=""
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
		isLocked=true
	else:
		$UI/Label.text="O"
		Input.set_mouse_mode(Input.MOUSE_MODE_HIDDEN)
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
		isLocked=false
		

func _input(event):
	if event is InputEventKey:
		if event.pressed and event.scancode == KEY_CONTROL:
			if isLocked:
				$"UI/3DLOCK".visible=false
			else:
				$"UI/3DLOCK".visible=true
			isLocked=!isLocked

	if event is InputEventMouseMotion and not isLocked:		
		head.rotate_y(deg2rad(-event.relative.x * mouse_sensitivity))

		var x_delta = event.relative.y * mouse_sensitivity
		if camera_x_rotation + x_delta > -90 and camera_x_rotation + x_delta < 90: 
			camera.rotate_x(deg2rad(-x_delta))
			camera_x_rotation += x_delta

func _physics_process(delta):
	$"UI/Label".margin_right=get_viewport().size.x
	$"UI/Label".margin_bottom=get_viewport().size.y
		
	$"UI/3DLOCK".margin_right=get_viewport().size.x
	$"UI/3DLOCK".margin_bottom=get_viewport().size.y
	var head_basis = head.get_global_transform().basis
	
	var direction = Vector3()
	if Input.is_action_pressed("move_forward"):
		direction -= head_basis.z
	elif Input.is_action_pressed("move_backward"):
		direction += head_basis.z
	
	if Input.is_action_pressed("move_left"):
		direction -= head_basis.x
	elif Input.is_action_pressed("move_right"):
		direction += head_basis.x
	
	direction = direction.normalized()
	
	velocity = velocity.linear_interpolate(direction * speed, acceleration * delta)
	velocity.y -= gravity
	
	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y += jump_power
	
	velocity = move_and_slide(velocity, Vector3.UP)
