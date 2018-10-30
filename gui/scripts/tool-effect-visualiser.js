{
    let MAX_POINTS = 500;

    //Create outline geometry and mesh
    let outlineGeometry = new THREE.BufferGeometry();
    outlineGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_POINTS * 3), 3));

    let outlineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    let tooloutline = new THREE.Line(outlineGeometry, outlineMaterial);
    tooloutline.position.y = 20;
    scene.add(tooloutline);



    Inputs.add("mousemove", (event) => {
        //Find vertices
        let mouse3D = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse3D, Camera.ThreeCamera);

        let meshesAndVertices = Tools.target.getAffectedMeshesAndVertices(raycaster, Tools.tool.brush)
        if (!meshesAndVertices) return;
        
        let vertices = meshesAndVertices.indexedVertices;


        //Find brush outline
        let outline = [];
        let ymax = Tools.tool.brush.length - 1;
        let xmax = Tools.tool.brush[ymax].length - 1

        //TODO: find ways to clean the following up:
        //Scans from each of the four sides in turn to
        //get them added to the outline array in the right order
        for (let y = ymax; y > 0; y--) {
            for (let x = 0; x < xmax; x++) {
                if (addVertex(x, y))
                    break;
            }
        }

        for (let x = 0; x < xmax; x++) {
            for (let y = 0; y < ymax; y++) {
                if (addVertex(x, y))
                    break;
            }
        }

        for (let y = 0; y < ymax; y++) {
            for (let x = xmax; x > 0; x--) {
                if (addVertex(x, y))
                    break;
            }
        }

        for (let x = xmax; x > 0; x--) {
            for (let y = ymax; y > 0; y--) {
                if (addVertex(x, y))
                    break;
            }
        }
        if(outline[0])
            outline.push(outline[0]);

        

        function addVertex(x, y) {
            if (Tools.tool.brush[y][x] > 0 && vertices[y] && vertices[y][x]) {
                outline.push({ x: x, y: y });
                return true;
            }
        }


        //Update the line mesh to show the outline
        let positions = tooloutline.geometry.attributes.position.array;
        let index = 0;

        outline.forEach(corner => {
            let y = corner.y;
            let x = corner.x;
            if (vertices[y] && vertices[y][x]) {
                vertex = vertices[y][x].getWorldPosition();
                positions[index++] = vertex.x;
                positions[index++] = vertex.y;
                positions[index++] = vertex.z;
            }
        })

        tooloutline.geometry.attributes.position.needsUpdate = true;
        tooloutline.geometry.setDrawRange(0, outline.length);
    })
}