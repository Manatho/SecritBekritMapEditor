class Tool {
    constructor(strength, size, brushtype, methods) {
        methods = methods ? methods : {}
        this.strength = strength;
        this._size = size

        this._brushscaler = methods.brushscaler ? methods.brushscaler : defaultScaler(brushtype);
        this.brush = this._brushscaler(this.size);
        this.tooling = methods.tooling ? methods.tooling : defaultTooling

        function defaultScaler(brushtype) {
            switch (brushtype) {
                case "square":
                    console.log("Wat");
                    return (size) => {
                        let brush = [];
                        for (let y = 0; y < size; y++) {
                            brush[y] = [];
                            for (let x = 0; x < size; x++) {
                                brush[y][x] = 1;
                            }
                        }
                        return brush
                    }
            }
        }

        function defaultTooling(tool, toolableVertices, invert) {
            tool.iterateBrush((x, y, strength) => {
                if (toolableVertices[y] && toolableVertices[y][x]) {
                    if (invert) {
                        toolableVertices[y][x].addHeight(strength * tool.strength);
                    } else {
                        toolableVertices[y][x].subtractHeight(strength * tool.strength);
                    }
                }
            })
        }
    }

    get size() {
        return this._size;
    }

    set size(size) {
        this._size = size;
        this.brush = this._brushscaler(this._size)

        console.log(this.brush);

    }

    applyToVertices(toolableVertices, invert) {
        this.tooling(this, toolableVertices, invert)
    }

    iterateBrush(brushfunction) {
        for (let y = 0; y < this.brush.length; y++) {
            for (let x = 0; x < this.brush[y].length; x++) {
                brushfunction(x, y, this.brush[y][x])
            }
        }
    }
}

{
    var Tools = {
        init: (targetTerrain) => {
            Inputs.add("mousedown", onDocumentMouseDown, { render: true })
            Inputs.add("mousemove", onDocumentMouseMove, { render: true })
            Tools.target = targetTerrain;


            Tools.availableTools =
                {
                    deincrease: new Tool(5, 1, "square"),
                    average: Tools.tool = new Tool(5, 5, "square", { tooling: average, brushscaler: averageBrush })
                }

            Tools.tool = Tools.availableTools.deincrease;

        },
    }

    let average = (tool, toolableVertices, invert) => {
        let tv = toolableVertices;
        tool.iterateBrush((x, y, strength) => {
            if (strength > 0) {
                let average = (tv[y - 1][x - 1].getHeight() + tv[y - 1][x].getHeight() + tv[y - 1][x + 1].getHeight()
                    + tv[y][x - 1].getHeight() + tv[y][x].getHeight() + tv[y][x + 1].getHeight()
                    + tv[y + 1][x - 1].getHeight() + tv[y + 1][x].getHeight() + tv[y + 1][x + 1].getHeight()) / 9;

                tv[y][x].setHeight(average);
            }
        })
    }

    let averageBrush = (size) => {
        size++;
        let brush = [];
        for (let y = 0; y < size; y++) {
            brush[y] = [];
            for (let x = 0; x < size; x++) {
                if(x == 0 || x == size -1 || y == 0 || y == size -1){
                    brush[y][x] = 0;
                } else {
                    brush[y][x] = 1;
                }
            }
        }
        return brush
    }

    let mouse3D;
    let onDocumentMouseDown = (event) => {
        event.preventDefault();

        mouse3D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        applyTool(event.button)


        let test = setInterval(() => {
            if (Inputs.isMouseDown) {
                applyTool(event.button)
            } else {
                clearInterval(test);
            }
        }, 10)
    }

    let onDocumentMouseMove = (event) => {
        event.preventDefault();
        mouse3D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    }


    let applyTool = (button) => {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse3D, Camera.ThreeCamera);

        let MeshesVertices;

        if (button != 1) {
            MeshesVertices = Tools.target.getAffectedMeshesAndVertices(raycaster, Tools.tool.brush)

            if (!MeshesVertices) {
                return;
            }
        }

        if (button == 0) {
            Tools.tool.applyToVertices(MeshesVertices.indexedVertices)
        } else if (button == 2) {
            Tools.tool.applyToVertices(MeshesVertices.indexedVertices, true)
        } else {
            return
        }
        Tools.target.updateGeometries(MeshesVertices.meshes);

    }

}


