<template></template>

<script>
//Libs and logic
let THREE = require("../../../libs/threemin.js");
let InputController = require("./scripts/input.js").Controller;
let Camera = require("./scripts/camera.js").Camera;
let ToolEffect = require("./scripts/tool-effect-visualiser.js").ToolEffect;
import { Controller, ControllerEvents } from "../../logic/controller.js";
import { Terrain } from "../../logic/terrain.js";
let scene;

function initAddons() {
	InputController.init(Controller.requestRender);
	Camera.init(InputController);
	ToolEffect.init(scene, InputController, Camera);
}

function setupToolApply() {
	let mouse3D;
	let raycaster = new THREE.Raycaster();

	let onDocumentMouseDown = event => {
		mouse3D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

		raycaster.setFromCamera(mouse3D, Camera.ThreeCamera);
		Controller.applyTool(raycaster, event.button);
		let reapply = 5;

		let test = setInterval(() => {
			if (InputController.isMouseDown) {
				raycaster.setFromCamera(mouse3D, Camera.ThreeCamera);
				Controller.applyTool(raycaster, event.button);
			} else {
				clearInterval(test);
			}
		}, reapply);
	};

	let onDocumentMouseMove = event => {
		mouse3D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
	};

	InputController.add("mousedown", onDocumentMouseDown, { render: true });
	InputController.add("mousemove", onDocumentMouseMove, { render: true });
}

function setupThree() {
	//Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xbab8b4);
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.x = 0;
	scene.add(directionalLight);

	initAddons();
	setupToolApply();

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
	renderloop();

	window.addEventListener("resize", onWindowResize, false);

	function onWindowResize() {
		Camera.ThreeCamera.aspect = window.innerWidth / window.innerHeight;
		Camera.ThreeCamera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	Controller.subscribe(ControllerEvents.Event_Terrain_Changed, setTerrain);

	window.Controller = Controller;
}

let terrain;
function setTerrain(newterrain) {
	if (terrain) {
		console.log("Remove");
		terrain.removeFromScene(scene);
	}
	console.log("Add");
	newterrain.addToScene(scene);
	terrain = newterrain;
}

setupThree();

export default {};
</script>

<style lang="scss">
.Three {
	display: block;
	position: relative;
}
</style>


