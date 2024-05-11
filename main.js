import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//const controls = new OrbitControls( camera, renderer.domElement );
//const loader = new GLTFLoader();

//renderer.setClearColor("#Ff6500");

// setClearColor sets the background
// takes in HEX values

// Types of cameras
// 1. Perspective (THREE.PerspectiveCamera(FOV, Aspect Ratio, Near Clipping Plane, Far Clipping Plane))
// objects farther than the far Clipping Plane and closer to the Near Clipping Plane won't be rendered

// To render at a lower resolution add a third boolean attribute to the setSize method and set it to false

const geometry = new THREE.BoxGeometry( 1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00});
const cube = new THREE.Mesh( geometry, material);
scene.add(cube);

camera.position.z = 5;

// Types of materials
// 1. MeshBasicMaterial(Hex Color, )
// everything added to the scene will be added to point 0,0,0

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};
animate();

// requestAnimationFrame() has many advantages over setInterval() but a big one is that pauses when the user 
// navigates to another browser tab, hence not wasting their precious processing power and battery life.




