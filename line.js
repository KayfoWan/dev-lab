import * as THREE from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL.js';

if (WebGL.isWebGLAvailable()) {

    const canvas = document.getElementById("canvas");
    const canvasHeight = canvas.clientHeight;
    const canvasWidth = canvas.clientWidth;
    const renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(canvasWidth, canvasHeight);

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    const scene = new THREE.Scene();

    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    const points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry, material );
    scene.add( line );

    function animate() {
        requestAnimationFrame(animate);
        renderer.render( scene, camera );
    };
    animate();

} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById( 'errorContainer' ).appendChild( warning );
}