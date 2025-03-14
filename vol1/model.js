import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

if (WebGL.isWebGLAvailable()) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const canvas = document.getElementById("canvas");
    const canvasHeight = canvas.clientHeight;
    const canvasWidth = canvas.clientWidth;
    const renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(canvasWidth, canvasHeight);

    const loader = new GLTFLoader();

    const pointLight = new THREE.PointLight(0xff0000, 100, 300);
    // arguments(color, intensity, distance, decay)
    pointLight.position.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0x404040, 550);

    const directionLight = new THREE.DirectionalLight(0xffffff, 5);
    // arguments(color, intensity)
    directionLight.target.position.set(0,0,0);
    directionLight.position.set(2, 5, 2);
    //Properties: castShadow (boolean), isDirectionalLight(boolean), .shadow,
    //      position, target



    let loadedModel;

    loader.onProgress = function(xhr) {
        const percentLoaded = Math.floor((xhr.loaded / xhr.total) * 100);
        console.log('Loading: ', percentLoaded + "%");
    };

    loader.load( '/models/porsche_911.glb', function(gltf) {
        loadedModel = gltf.scene;
        scene.add(loadedModel);
        scene.add(pointLight);
        scene.add(ambientLight);
        scene.add(directionLight);

    }, undefined, function(error) {
        console.error(error);
    });

    const target = new THREE.Vector3(0,0,0);

    camera.position.z = 5;
    camera.position.y = 1;
    camera.lookAt(target);

    function animate() {
        const model = loadedModel;
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        if(model) {
            model.rotation.y += .01;
        }
    }
    animate();

} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById( 'errorContainer' ).appendChild( warning );
}