import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { FilmPass } from "three/examples/jsm/Addons.js";

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

    let currentShape = "grid";
    let transitionProgress = 0.0;
    const transitionSpeed = 0.015;

    window.addEventListener('click', ()=>{
        if(currentShape === "grid") {
            currentShape = "sphere";
        } else {
            currentShape = "grid";
        }
    })
    
    if(!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    camera.position.z = 30;

    const particleCount = 15000;

    const currentPositions = new Float32Array(particleCount * 3);

    const gridPositions = new Float32Array(particleCount * 3);
    const spherePositions = new Float32Array(particleCount * 3);

    const gridSide = Math.sqrt(particleCount);
    const spacing = 0.3;

    for(let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const row = Math.floor(i / gridSide);
        const col = i % gridSide;

        gridPositions[i3 + 1] = (col - gridSide / 2) * spacing;
        gridPositions[i3 + 0] = 0;
        gridPositions[i3 + 2] = (row - gridSide / 2) * spacing;
    }

    const radius = 12;

    for(let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        spherePositions[i3 + 0] = Math.sin(phi) * Math.cos(theta) * radius;
        spherePositions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
        spherePositions[i3 + 2] = Math.cos(phi) * radius;
    }

    for(let i = 0; i < currentPositions.length; i++) {
        currentPositions[i] = gridPositions[i];
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.12,
        color: "lime",
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
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

    const filmPass = new FilmPass(0.25, false);
    composer.addPass(filmPass);

    const noise2D = createNoise2D()
    
    const animate = () => {
        requestAnimationFrame(animate);

        const positionAttr = particleGeometry.attributes.position.array as Float32Array;
        const time = window.performance.now() * 0.001;
        if(currentShape === "sphere") {
            if(transitionProgress < 1.0) transitionProgress += transitionSpeed;
        } else {
            if(transitionProgress > 0.0) transitionProgress -= transitionSpeed;
        }

        for(let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            const startX = gridPositions[i3 + 0];
            const startY = gridPositions[i3 + 1];
            const startZ = gridPositions[i3 + 2];

            const endX = spherePositions[i3 + 0];
            const endY = spherePositions[i3 + 1];
            const endZ = spherePositions[i3 + 2];

            const lerpX = startX + (endX - startX) * transitionProgress;
            const lerpY = startY + (endY - startY) * transitionProgress;
            const lerpZ = startZ + (endZ - startZ) * transitionProgress;

            const swarmIntensity = Math.sin(transitionProgress * Math.PI);

            const noiseX = noise2D(i * 0.05, time * 2.0) * 4.0 * swarmIntensity;
            const noiseY = noise2D(i * 0.05 + 100, time * 2.0) * 4.0 * swarmIntensity;
            const noiseZ = noise2D(i * 0.05 + 200, time * 2.0) * 4.0 * swarmIntensity;

            // positionAttr[i3 + 0] = startX + (endX - startX) * transitionProgress;
            // positionAttr[i3 + 1] = startY + (endY - startY) * transitionProgress;
            // positionAttr[i3 + 2] = startZ + (endZ - startZ) * transitionProgress;

            positionAttr[i3 + 0] = lerpX + noiseX;
            positionAttr[i3 + 1] = lerpY + noiseY;
            positionAttr[i3 + 2] = lerpZ + noiseZ;
        }

        particleGeometry.attributes.position.needsUpdate = true;

        particleSystem.rotation.y += 0.003;

        composer.render();
    };

    animate();

    window.addEventListener("resize", () => {
        const nWidth = window.innerWidth;
        const nHeight = window.innerHeight;
        camera.aspect = nWidth / nHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(nWidth, nHeight);
        composer.setSize(nWidth, nHeight);
    });
});