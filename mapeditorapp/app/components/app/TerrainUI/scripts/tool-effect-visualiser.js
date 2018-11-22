import { Controller } from "../../../logic/controller";
let THREE = require("../../../../libs/threemin");

export const ToolEffect = {
	centeredVertex: { x: 0, y: 0, z: 0 },
	init(scene, InputController, Camera) {
		let MAX_POINTS = 500;
		//Create outline geometry and mesh
		let outlineGeometry = new THREE.BufferGeometry();
		outlineGeometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(MAX_POINTS * 3), 3));

		let outlineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
		let tooloutline = new THREE.Line(outlineGeometry, outlineMaterial);
		tooloutline.position.y = 20;
		scene.add(tooloutline);

		InputController.add("mousemove", (event, rerender) => {
			if (Controller.terrain == null) {
				return;
			}

			//Find vertices
			let mouse3D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
			let raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse3D, Camera.ThreeCamera);
			let meshesAndVertices = Controller.terrain.getAffectedMeshesAndVertices(raycaster, Controller.tool.brush);

			if (!meshesAndVertices) return;

			let vertices = meshesAndVertices.indexedVertices;

			//Find brush outline
			let outline = [];
			let ymax = Controller.tool.brush.length - 1;
			let xmax = Controller.tool.brush[ymax].length - 1;

			tooloutline.position.x = meshesAndVertices.pressedVertex.x;
			tooloutline.position.z = meshesAndVertices.pressedVertex.z;
			this.centeredVertex.x = meshesAndVertices.pressedVertex.x;
			this.centeredVertex.y = meshesAndVertices.pressedVertex.y;
			this.centeredVertex.z = meshesAndVertices.pressedVertex.z;

			//TODO: find ways to clean the following up:
			//Scans from each of the four sides in turn to
			//get them added to the outline array in the right order
			for (let y = ymax; y > 0; y--) {
				for (let x = 0; x < xmax; x++) {
					if (addVertex(x, y)) break;
				}
			}

			for (let x = 0; x < xmax; x++) {
				for (let y = 0; y < ymax; y++) {
					if (addVertex(x, y)) break;
				}
			}

			for (let y = 0; y < ymax; y++) {
				for (let x = xmax; x > 0; x--) {
					if (addVertex(x, y)) break;
				}
			}

			for (let x = xmax; x > 0; x--) {
				for (let y = ymax; y > 0; y--) {
					if (addVertex(x, y)) break;
				}
			}
			if (outline[0]) outline.push(outline[0]);

			function addVertex(x, y) {
				if (Controller.tool.brush[y][x] > 0 && vertices[y] && vertices[y][x]) {
					outline.push({ x: x, y: y });
					return true;
				}
			}

			//Update the line mesh to show the outline
			let positions = tooloutline.geometry.attributes.position.array;
			let index = 0;

			outline.forEach(corner => {
				let y = corner.y;
				let x = corner.x;
				if (vertices[y] && vertices[y][x]) {
					let vertex = vertices[y][x].getWorldPosition();
					positions[index++] = vertex.x - tooloutline.position.x;
					positions[index++] = vertex.y;
					positions[index++] = vertex.z - tooloutline.position.z;
				}
			});

			tooloutline.geometry.attributes.position.needsUpdate = true;
			tooloutline.geometry.setDrawRange(0, outline.length);
			rerender();
		});
	}
};
