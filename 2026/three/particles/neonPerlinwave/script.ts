import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { FilmPass } from "three/examples/jsm/Addons.js";

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    
    if(!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    camera.position.z = 30;

    const gridCount = 100;
    const particleCount = gridCount * gridCount;
    const position = new Float32Array(particleCount * 3);

    const spacing = 0.5;

    for(let i = 0; i < gridCount; i++) {
        for(let j = 0; j < gridCount; j++) {
            const index = (i * gridCount + j) * 3;

            position[index + 0] = (i - gridCount / 2) * spacing;
            position[index + 1] = 0;
            position[index + 2] = (j - gridCount / 2) * spacing;
        }
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: "lime",
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(width, height);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.1
    );
    composer.addPass(bloomPass);

    const filmPass = new FilmPass(0.2, 0.4, 648, 0);
    composer.addPass(filmPass);

    const noise2D = createNoise2D();

    const animate = () => {
        requestAnimationFrame(animate);

        const positionAttr = particleGeometry.attributes.position.array as Float32Array;
        const time = window.performance.now() * 0.002;

        // for(let i = 0; i < particleCount; i++) {
        //     const i3 = i * 3;
        //     const x = positionAttr[i3 + 0];
        //     const z = positionAttr[i3 + 2];

        //     const distance = Math.sqrt(x * x + z * z);

        //     positionAttr[i3 + 1] = Math.sin(distance * 0.5 - time) * 1.5;
        // }

        for(let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const x = positionAttr[i3 + 0];
            const z = positionAttr[i3 + 2];

            const distance = Math.sqrt(x * x + z * z);

            const sineBase = Math.sin(distance * 0.4 - time) * 1.2;

            const noiseChop = noise2D(x * 0.1, z * 0.1 + time * 0.5) * 0.6;
            positionAttr[i3 + 1] = sineBase + noiseChop;
        }

        particleGeometry.attributes.position.needsUpdate = true;

        // renderer.render(scene, camera);
        composer.render();
    };

    animate();

    window.addEventListener("resize", () => {
        const nWidth = window.innerWidth;
        const nHeight = window.innerHeight;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        // renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(nWidth, nHeight);
        composer.setSize(nWidth, nHeight);
    });
});