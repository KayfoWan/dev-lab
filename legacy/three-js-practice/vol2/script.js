import * as THREE from 'three';

const WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
const camera = new THREE.PerspectiveCamera(70,WIDTH/HEIGHT,.01,10);
camera.position.z = 1;
const geometry = new THREE.PlaneGeometry(1,1);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
const scene = new THREE.Scene();
scene.add(mesh);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH,HEIGHT);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
function animate() {
    renderer.render(scene, camera);
}