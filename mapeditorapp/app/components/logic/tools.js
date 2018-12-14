export class Option {
	constructor(name, value, type) {
		this._name = name;
		this._value = value;
		this._type = type;
		this._onChanged = () => {};
	}

	set onChange(method) {
		this._onChanged = method;
	}

	set value(value) {
		this._value = value;
		this._onChanged(this._name, this._value);
	}

	get value() {
		return this._value;
	}

	get name() {
		return this._name;
	}

	get type() {
		return this._type;
	}

	copy() {
		return new Option(this._name, this._value);
	}
}

export class NumberOption extends Option {
	constructor(name, value, min, max) {
		super(name, value, "NUMBER");
		this._min = min != null ? min : -Number.MAX_VALUE;
		this._max = max != null ? max : Number.MAX_VALUE;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		this._value = Math.max(Math.min(value, this._max), this._min);
		this._onChanged(this._name, this._value);
	}

	copy() {
		return new NumberOption(this._name, this._value, this._min, this._max);
	}
}

export class TextOption extends Option {
	constructor(name, value, placeholder) {
		super(name, value, "TEXT");
		this._placeholder = placeholder;
	}

	get value() {
		return this._value == "" ? this._placeholder : this._value;
	}

	set value(value) {
		this._value = value;
		this._onChanged(this._name, this._value);
	}

	copy() {
		return new TextOption(this._name, this._value, this._placeholder);
	}
}

window.NumberOption = NumberOption;

export class Options {
	constructor(toolOptions, brushOptions) {
		this.tools = {};
		this.brush = {};
		this.all = [];

		toolOptions.forEach(option => {
			this.tools[option.name] = option;
			this.all.push(option);
		});
		brushOptions.forEach(option => {
			this.brush[option.name] = option;
			this.all.push(option);
		});
	}
}

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
