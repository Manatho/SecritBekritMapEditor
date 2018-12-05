class TerrainObjects {
	constructor() {
		this.towns = [];
		this.industries = [];
	}
	add(object) {
		if (object.type == "TOWN") {
			this.towns.add(object);
		}
	}
	remove(object) {
		if (object.type == "TOWN") {
			this.towns.remove(object);
		}
	}
}

export { TerrainObjects };
