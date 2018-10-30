{
    var Inputs = {
        isMouseDown: false,
        mouseDownEvent: {},

        _actions: {
            keydown: { render: false, methods: [] },
            keyup: { render: false, methods: [] },
            mousemove: { render: false, methods: [] },
            mousedown: { render: false, methods: [] },
            mouseup: { render: false, methods: [] },
            mousewheel: { render: false, methods: [] }
        },
        add: (actionType, action, opts) => {
            Inputs._actions[actionType].methods.push(action);

            if (opts && opts['render']) {
                Inputs._actions[actionType].render = opts.render;
            }

        },
        init: () => {

            Object.keys(Inputs._actions).forEach(actionKey => {
                document.addEventListener(actionKey, (event) => {
                    
                    if(!event.type.includes("mouse") || event.path[0].nodeName == "CANVAS"){
                        Inputs._actions[actionKey].methods.forEach(method => {
                            method(event)
                            if (Inputs._actions[actionKey].render) {
                                render();
                            }
                        });
                    } else {
                        Inputs.isMouseDown = false;
                    }
                }, false)
            });
        }

    }

    Inputs.add("mousedown", (event) => {
        Inputs.mouseDownEvent = event;
        Inputs.isMouseDown = true;
    }, {render: true})
    Inputs.add("mouseup", () => { Inputs.isMouseDown = false; }, { render: true })

}
