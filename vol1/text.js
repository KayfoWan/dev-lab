import * as THREE from 'three';
import WebGl from 'three/addons/capabilities/WebGL.js';

// 7 Ways to Write Text
// 1. (recommended) CSS + DOM
// 2. CSS2DRenderer + CSS3DRenderer
//    import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
//    import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
// 3. Draw text to canvas and use it as a Texture
// 4. Create a 3D model in an exterior application and export to three.js
// 5. Procedural Text Geometry 
//    new THREE.TextGeometry( text, parameters );
// 6. Bitmap Fonts (git repository)
// 7. Troika Fonts (library)

if (WebGl.isWebGLAvailable()) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const canvas = document.getElementById("canvas");
    const canvasHeight = canvas.clientHeight;
    const canvasWidth = canvas.clientWidth;
    const renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(canvasWidth, canvasHeight);

    const geometry = new THREE.BoxGeometry( 1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00});
    const cube = new THREE.Mesh( geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    };
    animate();

} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById( 'errorContainer' ).appendChild( warning );
}