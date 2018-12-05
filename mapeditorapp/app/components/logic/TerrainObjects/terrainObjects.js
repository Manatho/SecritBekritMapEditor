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
}

function arrayRemove(array, element) {
	let index = array.indexOf(element);
	if (index > -1) {
		array.splice(index, 1);
	}
}
export { TerrainObjects };
