extends CharacterBody2D

# Hoe snel je loopt en hoe hoog je springt. Speel hier gerust mee!
const SNELHEID = 300.0
const SPRONGKRACHT = -550.0

var zwaartekracht: float = ProjectSettings.get_setting("physics/2d/default_gravity")


func _physics_process(delta: float) -> void:
	# Vallen als je niet op de grond staat
	if not is_on_floor():
		velocity.y += zwaartekracht * delta

	# Springen: spatie of pijltje omhoog
	if is_on_floor() and (Input.is_action_just_pressed("ui_accept") or Input.is_action_just_pressed("ui_up")):
		velocity.y = SPRONGKRACHT

	# Links/rechts lopen met de pijltjes
	var richting := Input.get_axis("ui_left", "ui_right")
	velocity.x = richting * SNELHEID

	move_and_slide()

	# Van de wereld gevallen? Terug naar het begin!
	if position.y > 1200:
		position = Vector2(200, 400)
		velocity = Vector2.ZERO
