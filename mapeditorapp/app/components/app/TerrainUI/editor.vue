<template></template>

<script>
//Libs and logic
let THREE = require("../../../libs/threemin.js");
let InputController = require("./scripts/input.js").Controller;
let Camera = require("./scripts/camera.js").Camera;
let ToolEffect = require("./scripts/tool-effect-visualiser.js").ToolEffect;
import { Controller } from "../../logic/controller.js";
let terrain = Controller.terrain;

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xbab8b4);

let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.x = 0;
scene.add(directionalLight);

terrain.addToScene(scene);

let renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.insertBefore(renderer.domElement, document.body.firstChild);
renderer.domElement.className = "Three";

renderer.domElement.addEventListener("mousedown", e => {
	document.activeElement.blur();
});

function renderloop() {
	if (Controller.render) {
		Camera.update();
		renderer.render(scene, Camera.ThreeCamera);
	}
	requestAnimationFrame(renderloop);
}

InputController.init(Controller.requestRender);
Camera.init(InputController);
ToolEffect.init(scene, InputController, Camera);
renderloop();

let mouse3D;
let raycaster = new THREE.Raycaster();
let onDocumentMouseDown = event => {
	mouse3D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

	raycaster.setFromCamera(mouse3D, Camera.ThreeCamera);
	Controller.applyTool(raycaster, event.button);

	let test = setInterval(() => {
		if (InputController.isMouseDown) {
			raycaster.setFromCamera(mouse3D, Camera.ThreeCamera);
			Controller.applyTool(raycaster, event.button);
		} else {
			clearInterval(test);
		}
	}, 10);
};

let onDocumentMouseMove = event => {
	mouse3D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
};

InputController.add("mousedown", onDocumentMouseDown, { render: true });
InputController.add("mousemove", onDocumentMouseMove, { render: true });

export default {};
</script>

<style lang="scss">
.Three {
	display: block;
	position: relative;
}
</style>


