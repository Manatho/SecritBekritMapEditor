let THREE = require("../../../libs/threemin.js");

class Town {
	constructor(name, position, sizeFactor) {
		this.name = name;
		this.sizeFactor = sizeFactor;
		this.type = "TOWN";

		let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		let geometry = new THREE.BoxGeometry(100, 100, 100);
		this._townMesh = new THREE.Mesh(geometry, material);
		this._townMesh.position.x = position.x;
		this._townMesh.position.y = position.y;
		this._townMesh.position.z = position.z;
	}
	set type(invalid) {}
	set position(newPosition) {
		this._townMesh.position = newPosition;
	}

	get position() {
		return this._townMesh.position;
	}

	addToScene(scene) {
		scene.add(this._townMesh);
	}

	removeFromScene(scene) {
		this._townMesh.geometry.dispose();
		this._townMesh.geometry = null;
		this._townMesh.material.dispose();
		this._townMesh.material = null;
		this._townMesh = null;
	}
}

export { Town };
