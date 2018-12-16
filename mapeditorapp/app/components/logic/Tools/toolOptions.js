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
	constructor(name, value, min, max, increment) {
		super(name, value, OptionType.NUMBER);
		this.increment = increment ? increment : 1;
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
		super(name, value, OptionType.TEXT);
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

export class ChoiceOption extends Option {
	constructor(name, choices) {
        super(name, choices[0], OptionType.CHOICE);
        this.choices = choices;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		this._value = this.choices[value];
		this._onChanged(this._name, this._value);
	}

	copy() {
		return new TextOption(this._name, this._value, this._placeholder);
	}
}

export const OptionType = {
    TEXT: "TEXT",
    CHOICE: "CHOICE",
    NUMBER: "NUMBER"
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
