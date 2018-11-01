{
    //Camera/view stuff
    let cameraOffset, radius = 5500, theta = 170, phi = 160;
    let onMouseDownTheta, onMouseDownPhi, onMouseDownPosition = {x : 0, y : 0}

    Camera = {
        ThreeCamera: {},
        init: () => {
            Camera.ThreeCamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000000);
            cameraOffset = new THREE.Vector3(0, 0, 0);

            Camera.ThreeCamera.position.x = radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
            Camera.ThreeCamera.position.y = radius * Math.sin(phi * Math.PI / 360);
            Camera.ThreeCamera.position.z = radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);


            Inputs.add("mousewheel", onDocumentMouseWheel, { render: true })
            Inputs.add("keydown", onDocumentKeyDown, { render: true })
            Inputs.add("mousemove", onDocumentMouseMove, { render: true })
            Inputs.add("mousedown", onDocumentMouseDown)
        },
        update: () => {
            Camera.ThreeCamera.position.x = radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360) + cameraOffset.x;
            Camera.ThreeCamera.position.y = radius * Math.sin(phi * Math.PI / 360) + cameraOffset.y;
            Camera.ThreeCamera.position.z = radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360) + cameraOffset.z;
            Camera.ThreeCamera.lookAt(cameraOffset)
        }
    }

    let onDocumentMouseWheel = (event) => {
        event.preventDefault();
        radius -= event.wheelDeltaY*10;
        
        radius = Math.max(radius, 10);
    }

    let onDocumentKeyDown = (event) => {
        switch (event.key) {
            case "w":
                cameraOffset.x += 300;
                break;
            case "s":
                cameraOffset.x -= 300;
                break;
            case "d":
                cameraOffset.z += 300;
                break;
            case "a":
                cameraOffset.z -= 300;
                break;
        }
    }

    let onDocumentMouseDown = (event) => {
        event.preventDefault();

        onMouseDownTheta = theta;
        onMouseDownPhi = phi;
        onMouseDownPosition.x = event.clientX;
        onMouseDownPosition.y = event.clientY;
    }

    let onDocumentMouseMove = (event) => {
        event.preventDefault();
        
        if (Inputs.mouseDownEvent.button == 1 && Inputs.isMouseDown) {
            theta = - ((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta;
            phi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi;
            phi = Math.min(179, Math.max(0.1, phi));
        }
    }

}
