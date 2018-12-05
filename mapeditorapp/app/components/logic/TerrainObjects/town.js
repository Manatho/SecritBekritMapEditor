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
}

export { Town };
