let _actions = {
	keydown: { render: false, methods: [] },
	keyup: { render: false, methods: [] },
	mousemove: { render: false, methods: [] },
	mousedown: { render: false, methods: [] },
	mouseup: { render: false, methods: [] },
	mousewheel: { render: false, methods: [] }
};

let Controller = {
	isMouseDown: false,
	mouseDownEvent: {},

	add: (actionType, action, opts) => {
		_actions[actionType].methods.push(action);

		if (opts && opts["render"]) {
			_actions[actionType].render = opts.render;
		}
	},
	remove(actionType, action) {
		let index = _actions[actionType].methods.indexOf(action);
		if (index > -1) {
			_actions[actionType].methods.splice(index, 1);
		}
	},
	init: requestRender => {
		Object.keys(_actions).forEach(actionKey => {
			document.addEventListener(
				actionKey,
				event => {
					if (!event.type.includes("mouse") || event.path[0].nodeName == "CANVAS") {
						_actions[actionKey].methods.forEach(method => {
							method(event);
							if (_actions[actionKey].render) {
								requestRender();
							}
						});
					} else {
						Controller.isMouseDown = false;
					}
				},
				false
			);
		});
	}
};

Controller.add(
	"mousedown",
	event => {
		Controller.mouseDownEvent = event;
		Controller.isMouseDown = true;
	},
	{ render: true }
);
Controller.add(
	"mouseup",
	() => {
		Controller.isMouseDown = false;
	},
	{ render: true }
);

export { Controller };
