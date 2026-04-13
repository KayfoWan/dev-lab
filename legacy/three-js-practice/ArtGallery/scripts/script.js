import * as THREE from "three";
import { Reflector } from "three/examples/jsm/Addons.js";
import { Easing, Tween, update as updateTween } from "tween";

const images = [
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg',
    '6.jpg',
    '7.jpg',
    '8.jpg',
    '9.jpg',
    '10.jpg'
];

const titles = [
    "A Boob Once Fallen",
    "Squirt Sesh",
    "Anti Sag",
    "A Pussy Dripping",
    "The Boob Squeeze",
    "Dark Side of the Boob",
    "Apple Pie, Cherry Pie, Cream Pie",
    "Broken Bitch",
    "Knees Weak, Balls Are Sweaty",
    "Ass"
];

const artists = [
    "Minion",
    "Oompa Loompa",
    "Banjo Kazooie",
    "Mike's Hard Lemonade",
    "Twisted Tea Man",
    "Shiner Bock Goat",
    "Master Chief",
    "The Arbiter",
    "Sergeant Johnson",
    "Blockbuster"
];

const leftArrowCanvas = document.createElement("canvas");
leftArrowCanvas.width = 400;
leftArrowCanvas.height = 400;
const rightArrowCanvas = document.createElement("canvas");
rightArrowCanvas.width = 400;
rightArrowCanvas.height = 400;

const leftArrowCtx = leftArrowCanvas.getContext('2d');
leftArrowCtx.font = 'Bold 400px Arial';
leftArrowCtx.fillStyle = "white";
leftArrowCtx.fillText("<", (leftArrowCanvas.width/2 - 150), (leftArrowCanvas.height/2 + 125));
const rightArrowCtx = rightArrowCanvas.getContext('2d');
rightArrowCtx.font = 'Bold 400px Arial';
rightArrowCtx.fillStyle = "white";
rightArrowCtx.fillText(">", (rightArrowCanvas.width/2 - 150), (rightArrowCanvas.height/2 + 125));

const leftArrowTexture = new THREE.CanvasTexture(leftArrowCanvas);
const rightArrowTexture = new THREE.CanvasTexture(rightArrowCanvas);

const textureLoader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const rootNode = new THREE.Object3D();
scene.add(rootNode);

let count = 10;
for(let i = 0; i < count; i++) {
    const texture = textureLoader.load(images[i]);
    texture.colorSpace = THREE.SRGBColorSpace;
    const baseNode = new THREE.Object3D();
    baseNode.rotation.y = i * (2 * Math.PI / count);
    rootNode.add(baseNode);

    const border = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 2.2, 0.09),
        new THREE.MeshStandardMaterial({
            color: "rebeccaPurple"
        })
    )
    border.name = `Border_${i}`;
    border.position.z = -6;
    baseNode.add(border);
    const artwork = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 0.1),
        new THREE.MeshStandardMaterial({
            map: texture
        })
    );
    artwork.name = `Artwork_${i}`;
    artwork.position.z = -6;
    baseNode.add(artwork);

    const leftArrow = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.25, 0.0001),
        new THREE.MeshStandardMaterial({
            map: leftArrowTexture,
            transparent: true
        })
    );
    leftArrow.name = `LeftArrow`;
    leftArrow.userData = (i === count - 1) ? 0 : i + 1;
    leftArrow.position.set(-1.7, 0, -5.8);
    baseNode.add(leftArrow);

    const rightArrow = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.25, 0.0001),
        new THREE.MeshStandardMaterial({
            map: rightArrowTexture,
            transparent: true
        })
    );
    rightArrow.name = `RightArrow`;
    rightArrow.userData = (i === 0) ? count - 1 : i - 1;
    rightArrow.position.set(1.7, 0, -5.8);
    baseNode.add(rightArrow);
}

const spotlight = new THREE.SpotLight(0xffffff, 100.0, 10.0, .78, 1);
spotlight.position.set(0,5,0);
spotlight.target.position.set(0,1,-7);
scene.add(spotlight);
scene.add(spotlight.target);

const mirror = new Reflector(
    new THREE.CircleGeometry(10),
    {
        color: 0x303030,
        textureWidth: window.innerWidth,
        textureHeight: window.innerHeight
    }
)
mirror.position.y = -1.125;
mirror.rotateX(-Math.PI / 2);
scene.add(mirror);

function rotateGallery(direction, newIndex) {
    const deltaY = direction*(2*Math.PI/count);

    new Tween(rootNode.rotation).to({
        y: rootNode.rotation.y + deltaY
    })
    .easing(Easing.Quadratic.InOut)
    .start()
    .onStart(()=>{
        document.getElementById("title").style.opacity = 0;
        document.getElementById("artist").style.opacity = 0;
    })
    .onComplete(()=>{
        document.getElementById("title").innerHTML = titles[newIndex];
        document.getElementById("artist").innerHTML = artists[newIndex];
        document.getElementById("title").style.opacity = 1;
        document.getElementById("artist").style.opacity = 1;
    });
}

function animate() {
    // rootNode.rotation.y += 0.003;
    updateTween();
    renderer.render(scene, camera);
}

window.addEventListener("resize", ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mirror.getRenderTarget().setSize(
        window.innerWidth,
        window.innerHeight
    );
    leftArrowTexture.needsUpdate = true;
    rightArrowTexture.needsUpdate = true;
})

window.addEventListener('click', (e)=>{
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouseNDC, camera);
    const intersections = raycaster.intersectObject(rootNode, true);

    if(intersections.length > 0) {
        // console.log(intersections);

        const obj = intersections[0].object;
        const newIndex = obj.userData;
        if(obj.name === "LeftArrow") {
            rotateGallery(-1, newIndex);
        } else if(obj.name === "RightArrow") {
            rotateGallery(1, newIndex);
        }
    }
});

document.getElementById("title").innerHTML = titles[0];
document.getElementById("artist").innerHTML = artists[0];