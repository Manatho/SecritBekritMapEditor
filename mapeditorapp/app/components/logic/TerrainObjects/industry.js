import { ToolableVertex } from "../terrain.js";
import { Controller } from "../controller.js";

let THREE = require("../../../libs/threemin.js");

let height = 100;
let size = 130;
let offset = -size/2;
let shape = new THREE.Shape();
shape.moveTo(offset, offset);
shape.lineTo(offset, offset + size);
shape.lineTo(offset + size/2, offset + size + size/3);
shape.lineTo(offset + size, offset + size);
shape.lineTo(offset + size, offset);
shape.lineTo(offset, offset);

let extrudeSettings = {
    steps: 2,
    depth: height,
	bevelEnabled: false
};

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
		this.type = "INDUSTRY";

		this._position = position;

		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true });
		let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

		this.mesh = new THREE.Mesh(geometry, material);
		position = position.getWorldPosition();
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y + height/2;
		this.mesh.position.z = position.z;
		this.mesh.rotation.x = Math.PI / 2;

		this.angle = angle;
	}
	get position() {
		return this.mesh.position;
	}
	set angle(newAngle) {
		this._angle = newAngle % 360;
		this.mesh.rotation.z = -(Math.PI / 180) * this.angle;
		Controller.requestRender();
	}
	get angle() {
		return this._angle;
	}
	hovered() {
		this.mesh.material.opacity = 0.3;
	}
	unhovered() {
		this.mesh.material.opacity = 0.7;
	}
	updatePosition() {
		this.mesh.position.y = this._position.height + this._position.baseline + height/2;
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
		this.unhovered = () => {};
		this.hovered = () => {};
	}
	toLuaString() {
		return `{ pos = { ${this.position.x}, ${-this.position.z} }, angle = math.rad(${this.angle}), name = _("${
			this.name
		}"), fileName = "industry/${this.industry}.con"},\n`;
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
		return new Industry(savedObject.name, position, savedObject.industry, savedObject.angle);
	}
}

export { Industry };
