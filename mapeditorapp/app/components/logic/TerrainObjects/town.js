import { ToolableVertex } from "../terrain.js";
import { TOWN_SIZE_FACTOR_MIN, TOWN_SIZE_FACTOR_MAX } from "../constants.js";
import { Controller } from "../controller.js";

let THREE = require("../../../libs/threemin.js");

const normalTownArea = Math.PI * (400*400) //circle area;

class Town {
	/**
	 *
	 * @param {string} name
	 * @param {ToolableVertex} position
	 * @param {Number} sizeFactor
	 */
	constructor(name, position, sizeFactor) {
		this.name = name;
		this._sizeFactor = sizeFactor;
		this.type = "TOWN";

		this._position = position;

		let material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true });

		let radius = Math.sqrt((normalTownArea * (sizeFactor*0.8))/Math.PI);
		let geometry = new THREE.CylinderGeometry(radius, radius, 100, 20);
		this.mesh = new THREE.Mesh(geometry, material);
		position = position.getWorldPosition();
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		this.mesh.position.z = position.z;
	}
	get position() {
		return this.mesh.position;
	}
	get sizeFactor(){
		return this._sizeFactor;
	}
	set sizeFactor(size){
		this._sizeFactor = Math.min(Math.max(size, TOWN_SIZE_FACTOR_MIN), TOWN_SIZE_FACTOR_MAX);
		let scale = Math.sqrt((normalTownArea * (this._sizeFactor*0.8))/Math.PI) / this.mesh.geometry.parameters.radiusTop;
		this.mesh.scale.x = scale;
		this.mesh.scale.z = scale;
		Controller.requestRender();
		
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
	toLuaString(){
		return `{ pos = { ${this.position.x}, ${-this.position.z} }, name = _("${this.name}"), sizeFactor = ${this.sizeFactor}},\n`
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
