import { ToolableVertex } from "../terrain.js";

let THREE = require("../../../libs/threemin.js");

class Town {
	/**
	 *
	 * @param {string} name
	 * @param {ToolableVertex} position
	 * @param {Number} sizeFactor
	 */
	constructor(name, position, sizeFactor) {
		this.name = name;
		this.sizeFactor = sizeFactor;
		this.type = "TOWN";

		this._position = position;

		let material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true });
		let geometry = new THREE.BoxGeometry(100, 100, 100);
		this.mesh = new THREE.Mesh(geometry, material);
		position = position.getWorldPosition();
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		this.mesh.position.z = position.z;
	}
	get position() {
		return this.mesh.position;
	}
	updatePosition() {
		this.mesh.position.y = this._position.height + 150;
	}

	addToScene(scene) {
		scene.add(this.mesh);
	}

	removeFromScene(scene) {
		scene.remove(this.mesh);
		this.mesh.geometry.dispose();
		this.mesh.geometry = null;
		this.mesh.material.dispose();
		this.mesh.material = null;
		this.mesh = null;
	}

	save() {
		let saveObject = {};
		saveObject.name = this.name;
		saveObject.sizeFactor = this.sizeFactor;
		saveObject.type = this.type;
		saveObject.positionIndex = this._position.getIndex();
		saveObject.positionMeshName = this._position.getMeshName();
		return saveObject;
	}

	static load(savedObject, terrain) {
		let mesh = terrain.getMesh(savedObject.positionMeshName);
		let position = new THREE.Vector3(
			mesh.geometry.attributes.position.array[savedObject.positionIndex + 0],
			mesh.geometry.attributes.position.array[savedObject.positionIndex + 1],
			mesh.geometry.attributes.position.array[savedObject.positionIndex + 2]
		);
		mesh.updateMatrixWorld();

		position.index = savedObject.positionIndex;
		position = new ToolableVertex(position, mesh, 0, 0);
		return new Town(savedObject.name, position, savedObject.sizeFactor);
	}
}

export { Town };
