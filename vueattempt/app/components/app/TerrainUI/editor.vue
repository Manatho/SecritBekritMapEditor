<template>

</template>

<script>
let THREE = require("./lib/threemin.js");
let InputController = require("./scripts/input.js").Controller;
let Camera = require("./scripts/camera.js").Camera;

export default {};

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xbab8b4);

let renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.x = 0;
scene.add(directionalLight);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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
</script>

<style>
</style>
