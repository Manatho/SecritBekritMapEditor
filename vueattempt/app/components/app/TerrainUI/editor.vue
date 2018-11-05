<template></template>

<script>
//Libs and logic

let THREE = require("../../../libs/threemin.js");
let InputController = require("./scripts/input.js").Controller;
let Camera = require("./scripts/camera.js").Camera;
let terrain = require("../../logic/controller.js").Controller.Terrain;
console.log(terrain);

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

let changed = true;
function requestRender() {
	changed = true;
}

function renderloop() {
	if (changed) {
		Camera.update();
		renderer.render(scene, Camera.ThreeCamera);
		changed = false;
	}
	requestAnimationFrame(renderloop);
}

InputController.init(requestRender);
Camera.init(InputController);
renderloop();

export default {};
</script>

<style lang="scss">
.Three {
	display: block;
	position: relative;
}
</style>


