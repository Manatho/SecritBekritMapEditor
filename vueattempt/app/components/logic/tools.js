export class Option {
	constructor(name, value, min, max) {
		this._name = name;
		this._value = value;
		this._min = min != null ? min : -Number.MAX_VALUE;
		this._max = max != null ? max : Number.MAX_VALUE;
		this._onChanged = () => {};
	}

	set onChange(method) {
		this._onChanged = method;
	}

	get name() {
		return this._name;
	}

	get min() {
		return this._min;
	}

	get max() {
		return this._max;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		this._value = Math.max(Math.min(value, this._max), this._min);
		this._onChanged(this._name, this._value);
	}

	copy() {
		return new Option(this._name, this._value, this._min, this._max);
	}
}

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
		this.options = options.all;
		console.log(this.options);

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
	}
}

function defaultTooling(tool, toolableVertices, invert) {
	tool.iterateBrush((x, y, strength) => {
		if (toolableVertices[y] && toolableVertices[y][x]) {
			if (invert) {
				toolableVertices[y][x].height += strength * tool.toolOptions.strength.value;
			} else {
				toolableVertices[y][x].height -= strength * tool.toolOptions.strength.value;
			}
		}
	});
}
