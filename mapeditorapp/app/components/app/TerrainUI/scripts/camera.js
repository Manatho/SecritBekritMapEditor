let THREE = require("../../../../libs/threemin");
let InputController = null;

//Camera/view stuff
let direction = new THREE.Vector3();
let cameraOffset,
	radius = 5500,
	theta = 180,
	phi = 170;
let onMouseDownTheta,
	onMouseDownPhi,
	onMouseDownPosition = { x: 0, y: 0 };

let Camera = {
	ThreeCamera: {},
	init: inputController => {
		InputController = inputController;
		Camera.ThreeCamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 10, 50000);
		cameraOffset = new THREE.Vector3(0, 0, 0);

		Camera.ThreeCamera.position.x = radius * Math.sin((theta * Math.PI) / 360) * Math.cos((phi * Math.PI) / 360);
		Camera.ThreeCamera.position.y = radius * Math.sin((phi * Math.PI) / 360);
		Camera.ThreeCamera.position.z = radius * Math.cos((theta * Math.PI) / 360) * Math.cos((phi * Math.PI) / 360);

		InputController.add("mousewheel", onDocumentMouseWheel);
		InputController.add("keydown", onDocumentKeyDown);
		InputController.add("keyup", onDocumentKeyUp);
		InputController.add("mousemove", onDocumentMouseMove);
		InputController.add("mousedown", onDocumentMouseDown);
	},
	update: () => {
		Camera.ThreeCamera.position.x = radius * Math.sin((theta * Math.PI) / 360) * Math.cos((phi * Math.PI) / 360) + cameraOffset.x;
		Camera.ThreeCamera.position.y = radius * Math.sin((phi * Math.PI) / 360) + cameraOffset.y;
		Camera.ThreeCamera.position.z = radius * Math.cos((theta * Math.PI) / 360) * Math.cos((phi * Math.PI) / 360) + cameraOffset.z;
		Camera.ThreeCamera.lookAt(cameraOffset);
		Camera.ThreeCamera.getWorldDirection(direction);
	}
};

// Keyboard navigation
let requestRerender;
let baseSpeed = 5;
let speed = 5;
let acceerlaration = 1;
let isMoving = false;
let keyDirection = 0;
let movementKeyPressed = [];
let onDocumentKeyDown = (event, render) => {
	if (movementKeyPressed[event.key] == undefined) {
		if (["w", "a", "s", "d"].indexOf(event.key) != -1) {
			movementKeyPressed[event.key] = true;
			let movement = updateKeyDirection();

			if (!isMoving) {
				isMoving = movement;
				requestRerender = render;
				move(200);
			}
		}
	}
};

function move(initial) {
	initial = initial || 30;

	if (isMoving) {
		let movedir = Math.atan2(direction.x, direction.z);
		speed += acceerlaration;
		cameraOffset.x += speed * Math.sin(movedir + keyDirection);
		cameraOffset.z += speed * Math.cos(movedir + keyDirection);
		requestRerender();
		setTimeout(move, initial);
	} else {
		speed = baseSpeed;
	}
}

function updateKeyDirection() {
	let horizontal = false;
	let vertical = false;
	keyDirection = 0;
	if (movementKeyPressed["w"]) {
		vertical = !vertical;
	}

	if (movementKeyPressed["s"]) {
		keyDirection += Math.PI;
		vertical = !vertical;
	}

	if (movementKeyPressed["a"]) {
		keyDirection += Math.PI / 2;
		horizontal = !horizontal;
	}

	if (movementKeyPressed["d"]) {
		keyDirection += Math.PI * 1.5;
		horizontal = !horizontal;
	}

	if (horizontal && vertical) {
		if (movementKeyPressed["d"] && movementKeyPressed["w"]) {
			keyDirection = Math.PI * 1.75;
		} else {
			keyDirection = (keyDirection / 2) % 180;
		}
	}

	return horizontal || vertical;
}

let onDocumentKeyUp = event => {
	delete movementKeyPressed[event.key];
	if (Object.keys(movementKeyPressed).length == 0) {
		isMoving = false;
	} else {
		updateKeyDirection();
	}
};

// Mouse navigation

let onDocumentMouseWheel = (event, render) => {
	event.preventDefault();
	radius -= event.wheelDeltaY;
	radius = Math.max(radius, 10);
	render();
};

let onDocumentMouseDown = event => {
	event.preventDefault();
	onMouseDownTheta = theta;
	onMouseDownPhi = phi;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
};

let onDocumentMouseMove = event => {
	event.preventDefault();
	if (InputController.mouseDownEvent.button == 1 && InputController.isMouseDown) {
		theta = -((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta;
		phi = (event.clientY - onMouseDownPosition.y) * 0.5 + onMouseDownPhi;
		phi = Math.min(179, Math.max(0.1, phi));
	}
};

export { Camera };
