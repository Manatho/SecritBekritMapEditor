

//Scene stuff
var scene, renderer;

//Input stuff


//objects
var planeMesh, mouseIntersection;


function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbab8b4);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.x = 0;
    scene.add(directionalLight);


    terrain = new Terrain();
    terrain.addToScene(scene);

    






    Inputs.init();
    Camera.init();
    Tools.init(terrain);
}

var lastTime;
function render() {



    
    Camera.update();
    renderer.render(scene, Camera.ThreeCamera);
    lastTime = new Date().getTime()/ 100;
}


init();
render();