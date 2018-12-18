import { Options } from "./toolOptions";

export class Tool {
	constructor(brushtype, methods, options) {
		if (options == null) {
			options = new Options([], []);
		}

		this.options = options.all;

		this.toolOptions = options.tools;
		this.brushOptions = options.brush;

		methods = methods ? methods : {};
		this._brushscaler = methods.brushscaler ? methods.brushscaler : defaultScaler(brushtype);
		this.brush = this._brushscaler(this);

		this.tooling = methods.tooling ? methods.tooling : defaultTooling;

		for (let key in this.brushOptions) {
			this.brushOptions[key].onChange = () => {
				this.brush = this._brushscaler(this);
			};
		}
	}

	applyToVertices(toolableVertices, invert) {
		this.tooling(this, toolableVertices, invert);
	}

	applyTool(raycaster, terrain, direction) {
		if (terrain == null) {
			return;
		}
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

function defaultScaler(brushtype) {
	switch (brushtype) {
		case "square":
			return tool => {
				let brush = [];
				for (let y = 0; y < tool.brushOptions.size.value; y++) {
					brush[y] = [];
					for (let x = 0; x < tool.brushOptions.size.value; x++) {
						brush[y][x] = 1;
					}
				}
				return brush;
			};
		case "gauss":
			return tool => {
				let brush = [];
				let center = tool.brushOptions.size.value / 2;
				let sigma = center * 0.7;
				if (tool.brushOptions.size.value % 2 == 0) {
					center -= 0.5;
				} else {
					center >>= 0;
				}

				//let func = makeGaussian(1, center, center, sigma, sigma);
				let func = makeQuadratic(1.4, sigma, center);
				for (let y = 0; y < tool.brushOptions.size.value; y++) {
					brush[y] = [];
					for (let x = 0; x < tool.brushOptions.size.value; x++) {
						brush[y][x] = func(x, y);
						if (brush[y][x] < 0.01) {
							brush[y][x] = 0;
						}
					}
				}

				return brush;
			};
	}
}
window.gauss = defaultScaler("gauss");

function makeQuadratic(amplitude, h, c) {
	return function(amplitude, h, c, x, y) {
		return -(Math.pow(x - c, 2) / (h * h) + Math.pow(y - c, 2) / (h * h)) + amplitude;
	}.bind(null, amplitude, h, c);
}

function makeGaussian(amplitude, x0, y0, sigmaX, sigmaY) {
	return function(amplitude, x0, y0, sigmaX, sigmaY, x, y) {
		var exponent = -(Math.pow(x - x0, 2) / (2 * Math.pow(sigmaX, 2)) + Math.pow(y - y0, 2) / (2 * Math.pow(sigmaY, 2)));
		return amplitude * Math.pow(Math.E, exponent);
	}.bind(null, amplitude, x0, y0, sigmaX, sigmaY);
}

function defaultTooling(tool, toolableVertices, invert) {
	tool.iterateBrush((x, y, strength) => {
		if (toolableVertices[y] && toolableVertices[y][x]) {
			if (invert) {
				//console.log(strength * tool.toolOptions.strength.value, toolableVertices[y][x].height);

				toolableVertices[y][x].height -= strength * tool.toolOptions.strength.value;
			} else {
				toolableVertices[y][x].height += strength * tool.toolOptions.strength.value;
			}
		}
	});
}
