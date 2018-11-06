import { Controller } from "./controller";

export class Tool {
	constructor(strength, size, brushtype, methods) {
		methods = methods ? methods : {};
		this.strength = strength;
		this._size = size;

		this._brushscaler = methods.brushscaler ? methods.brushscaler : defaultScaler(brushtype);
		this.brush = this._brushscaler(this.size);
		this.tooling = methods.tooling ? methods.tooling : defaultTooling;

		function defaultScaler(brushtype) {
			switch (brushtype) {
				case "square":
					return size => {
						let brush = [];
						for (let y = 0; y < size; y++) {
							brush[y] = [];
							for (let x = 0; x < size; x++) {
								brush[y][x] = 1;
							}
						}
						return brush;
					};
			}
		}

		function defaultTooling(tool, toolableVertices, invert) {
			tool.iterateBrush((x, y, strength) => {
				if (toolableVertices[y] && toolableVertices[y][x]) {
					if (invert) {
						toolableVertices[y][x].height += strength * tool.strength;
					} else {
						toolableVertices[y][x].height -= strength * tool.strength;
					}
				}
			});
		}
	}

	get size() {
		return this._size;
	}

	set size(size) {
		this._size = size;
		this.brush = this._brushscaler(this._size);
	}

	applyToVertices(toolableVertices, invert) {
		this.tooling(this, toolableVertices, invert);
	}

	applyTool(raycaster, terrain, direction) {
		let MeshesVertices;
		if (direction != 1) {
			MeshesVertices = terrain.getAffectedMeshesAndVertices(raycaster, this.brush);
			if (!MeshesVertices) {
				return;
			}
		}

		if (direction == 0) {
			this.applyToVertices(MeshesVertices.indexedVertices);
		} else if (direction == 2) {
			this.applyToVertices(MeshesVertices.indexedVertices, true);
		} else {
			return;
		}
		terrain.updateGeometries(MeshesVertices.meshes);
	}

	iterateBrush(brushfunction) {
		for (let y = 0; y < this.brush.length; y++) {
			for (let x = 0; x < this.brush[y].length; x++) {
				brushfunction(x, y, this.brush[y][x]);
			}
		}
	}
}
