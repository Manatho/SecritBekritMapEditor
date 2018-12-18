import { Town } from "./town";
import { Industry } from "./industry";
class TerrainObjects {
	constructor() {
		/** @type {Town[]} */ this.towns = [];
		/** @type {Industry[]} */ this.industries = [];
		this.meshes = [];
	}
	add(object) {
		if (object.type == "TOWN") {
			this.towns.push(object);
		} else {
			this.industries.push(object);
		}
			object.mesh.owner = object;
			this.meshes.push(object.mesh);
		
	}
	remove(object) {
		if (object.type == "TOWN") {
			arrayRemove(this.towns, object);
		} else {
			arrayRemove(this.industries, object);
		}
		arrayRemove(this.meshes, object.mesh);
	}
	updatePosition() {
		this.towns.forEach(town => {
			town.updatePosition();
		});
		this.industries.forEach(industry => {
			industry.updatePosition();
		});
	}
	addAllToScene(scene) {
		this.towns.forEach(town => {
			town.addToScene(scene);
		});
		this.industries.forEach(industry => {
			industry.addToScene(scene);
		});
	}
	removeAllFromScene(scene) {
		this.towns.forEach(town => {
			town.removeFromScene(scene);
		});
		this.industries.forEach(industry => {
			industry.removeFromScene(scene);
		});
	}
	/**
	 * @returns {String}
	 */
	createTownString() {
		let string = "";
		this.towns.forEach(town => {
			string += "  " + town.toLuaString();
		});
		return string.substring(0, string.length - 2); // Exclude last ",\n" from string
	}
	createIndustryString(){
		let string = "";
		this.industries.forEach(industry => {
			string += "  " + industry.toLuaString();
		});
		return string.substring(0, string.length - 2); // Exclude last ",\n" from string
	}
	save() {
		let data = {};
		data.towns = [];
		data.industries = [];
		this.towns.forEach(town => {
			data.towns.push(town.save());
		});
		this.industries.forEach(industry => {
			data.industries.push(industry.save());
		});
		return data;
	}
	static load(savedTerrainobjects, terrain) {
		let terrainObjects = new TerrainObjects();
		savedTerrainobjects.towns.forEach(town => {
			terrainObjects.add(Town.load(town, terrain));
		});
		savedTerrainobjects.industries.forEach(industry => {
			terrainObjects.add(Industry.load(industry, terrain));
		});
		return terrainObjects;
	}
}

function arrayRemove(array, element) {
	let index = array.indexOf(element);
	if (index > -1) {
		array.splice(index, 1);
	}
}
export { TerrainObjects };
