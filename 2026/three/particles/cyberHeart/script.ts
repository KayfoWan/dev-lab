import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { FilmPass } from "three/examples/jsm/Addons.js";

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    const startButton = document.getElementById('start-btn') as HTMLButtonElement | null;

    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: InstanceType<typeof window.Uint8Array>;
    let isAudioSetup = false;

    startButton?.addEventListener('click', () => {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            analyser.fftSize = 512;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            isAudioSetup = true;
            startButton.style.display = "none";
        }).catch(err=> console.error("Mic access denied", err));
    });
    
    if(!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    camera.position.z = 30;

    const particleCount = 8000;
    const position = new Float32Array(particleCount * 3);

    const origX = new Float32Array(particleCount);
    const origY = new Float32Array(particleCount);
    const origZ = new Float32Array(particleCount);

    const radius = 10;

    for(let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);

        origX[i] = x;
        origY[i] = y;
        origZ[i] = z;

        position[i3 + 0] = x * radius;
        position[i3 + 1] = y * radius;
        position[i3 + 2] = z * radius;
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

    const filmPass = new FilmPass(0.25, false);
    composer.addPass(filmPass);

    const noise2D = createNoise2D();

    const animate = () => {
        requestAnimationFrame(animate);

        const positionAttr = particleGeometry.attributes.position.array as Float32Array;
        const time = window.performance.now() * 0.001;

        let bassIntensity = 0;

        if(isAudioSetup && analyser && dataArray) {
            analyser.getByteFrequencyData(dataArray)

            let bassSum = 0;
            for(let i = 0; i < 10; i++) {
                bassSum += dataArray[i];
            }

            bassIntensity = (bassSum / 10) / 255
        }

        for(let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            const ox = origX[i];
            const oy = origY[i];
            const oz = origZ[i];

            const noiseVal = noise2D(ox * 2 + time, oy * 2 + time * 0.5);

            const dynamicRadius = radius + (noiseVal * bassIntensity * 12);

            positionAttr[i3 + 0] = ox * dynamicRadius;
            positionAttr[i3 + 1] = oy * dynamicRadius;
            positionAttr[i3 + 2] = oz * dynamicRadius;
        }

        particleGeometry.attributes.position.needsUpdate = true;

        particleSystem.rotation.y += 0.002;
        particleSystem.rotation.x += 0.001;

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