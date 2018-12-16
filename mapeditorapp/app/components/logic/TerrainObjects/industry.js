import { ToolableVertex } from "../terrain.js";

let THREE = require("../../../libs/threemin.js");

class Industry {
	/**
	 *
	 * @param {string} name
	 * @param {ToolableVertex} position
     * @param {Number} angle - Degrees
	 * @param {string} industry
	 */
	constructor(name, position, industry, angle) {
		this.name = name;
        this.industry = industry;
        this.angle = angle;
		this.type = "INDUSTRY";

		this._position = position;

		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true });

		let geometry = new THREE.BoxGeometry(130, 100, 130);
		this.mesh = new THREE.Mesh(geometry, material);
		position = position.getWorldPosition();
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
        this.mesh.rotation.y = Math.PI/180 * (this.angle % 360);
	}
	get position() {
		return this.mesh.position;
	}
	hovered(){
		this.mesh.material.opacity = 0.3;
	}
	unhovered(){
		this.mesh.material.opacity = 0.7;
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
        this.unhovered = () => {}
		this.hovered = () => {}
	}

	save() {
		let saveObject = {};
		saveObject.name = this.name;
        saveObject.type = this.type;
        saveObject.angle = this.angle;
        saveObject.industry = this.industry;
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
		return new Industry(savedObject.name, position, savedObject.industry, savedObject.industry);
	}
}

export { Industry };
