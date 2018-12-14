import { Town } from "./town";

class TerrainObjects {
	constructor() {
		this.towns = [];
		this.industries = [];
		this.meshes = [];
	}
	add(object) {
		if (object.type == "TOWN") {
			this.towns.push(object);
			object.mesh.owner = object;
			this.meshes.push(object.mesh);
		}
	}
	remove(object) {
		if (object.type == "TOWN") {
			arrayRemove(this.towns, object);
			arrayRemove(this.meshes, object.mesh);
		}
	}
	updatePosition() {
		this.towns.forEach(town => {
			town.updatePosition();
		});
	}
	addAllToScene(scene) {
		this.towns.forEach(town => {
			town.addToScene(scene);
		});
	}
	removeAllFromScene(scene) {
		this.towns.forEach(town => {
			town.removeFromScene(scene);
		});
	}
	save() {
		let data = {};
		data.towns = [];
		this.towns.forEach(town => {
			data.towns.push(town.save());
		});
		return data;
	}
	static load(savedTerrainobjects, terrain) {
		let terrainObjects = new TerrainObjects();
		savedTerrainobjects.towns.forEach(town => {
			terrainObjects.add(Town.load(town, terrain));
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
