let THREE = require("../../../libs/threemin.js");

class Town {
	constructor(name, position, sizeFactor) {
		this.name = name;
		this.sizeFactor = sizeFactor;
		this.type = "TOWN";

		let material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true });
		let geometry = new THREE.BoxGeometry(100, 100, 100);
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		this.mesh.position.z = position.z;
	}
	set position(newPosition) {
		this.mesh.position = newPosition;
	}

	get position() {
		return this.mesh.position;
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
}

export { Town };
