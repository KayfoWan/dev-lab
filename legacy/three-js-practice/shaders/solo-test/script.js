import * as THREE from 'three';

const width = window.innerWidth, height = window.innerHeight;

class Character {
    constructor(pos) {
        this.startPosition = new THREE.Vector3(2,2,2);
        this.camera = new THREE.PerspectiveCamera(70,width/height,0.01,10);
    }
}

//camera
const character = new THREE.PerspectiveCamera(70,width/height,0.01,10);
character.position.z = 2;
const camera = character;

//geometry
const geometry = new THREE.PlaneGeometry(1,1);

//material
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);

//scene
const scene = new THREE.Scene();
scene.add(mesh);

//render
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
//animation
function animate(time) {
    mesh.rotation.x = time / 1000;
    renderer.render(scene, camera);
}