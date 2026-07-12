import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";

import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { FilmPass } from "three/examples/jsm/Addons.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

    if(!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize(width, height);

    const particleCount = 15000;

    //memory block allocation
    const currentPositions = new Float32Array(particleCount * 3);
    const gridPositions = new Float32Array(particleCount * 3);
    const spherePositions = new Float32Array(particleCount * 3);
    const modelPositions = new Float32Array(particleCount * 3);
    const model2Positions = new Float32Array(particleCount * 3);
    const model3Positions = new Float32Array(particleCount * 3);
    const model4Positions = new Float32Array(particleCount * 3);
    const model5Positions = new Float32Array(particleCount * 3);
    const model6Positions = new Float32Array(particleCount * 3);

    //grid generation
    const grideSide = Math.sqrt(particleCount);
    const spacing = 0.3;
    for(let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const row = Math.floor(i / grideSide);
        const col = i % grideSide;

        gridPositions[i3 + 1] = (col - grideSide / 2) * spacing;
        gridPositions[i3 + 0] = 0;
        gridPositions[i3 + 2] = (row - grideSide / 2) * spacing;
    }

    //sphere generation
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

    //starting state init
    for(let i = 0; i < currentPositions.length; i++) {
        currentPositions[i] = gridPositions[i];
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.12,
        color: "#00ffcc",
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        1.5,
        0.4,
        0.15
    );
    // composer.addPass(bloomPass);

    const filmPass = new FilmPass(0.15, false);
    composer.addPass(filmPass);

    let shapeIndex = 0;
    const shapes = ["grid", "sphere", "model", "model2", "model3", "model4", "model5", "model6"];

    window.addEventListener("click", () => {
        shapeIndex = (shapeIndex + 1) % shapes.length;
        console.log("Target shape is now:", shapes[shapeIndex]);
    });


    //Model
    const modelUrl = new URL(
        "../../public/assets/newModels/the_perfect_steve_rigged/scene.gltf", 
        import.meta.url
    ).href;

    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
        let targetMesh: THREE.Mesh | null = null;
        gltf.scene.traverse(child => {
            if((child as THREE.Mesh).isMesh && !targetMesh) {
                targetMesh = child as THREE.Mesh;
            }
        });

        if(targetMesh) {
            console.log("Found mesh. Sampling points...");
            const sampler = new MeshSurfaceSampler(targetMesh).build();
            const tempPosition = new THREE.Vector3();

            for(let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                sampler.sample(tempPosition);

                const modelScale = 2.5;

                modelPositions[i3 + 0] = tempPosition.x * modelScale;
                modelPositions[i3 + 1] = tempPosition.y * modelScale;
                modelPositions[i3 + 2] = tempPosition.z * modelScale;
            }

            console.log("Model sampling complete! Cache filled.");

            gltf.scene.visible = false;
        }
    }, undefined, (error) => {
        console.error("An error happened while loading the model:", error);
    });


    //Model 2
    const model2Url = new URL(
        "../../public/assets/newModels/louise_francoise_pink_bunny/scene.gltf", 
        import.meta.url
    ).href;

    const loader2 = new GLTFLoader();
    loader2.load(model2Url, (gltf) => {
        let target2Mesh: THREE.Mesh | null = null;
        gltf.scene.traverse(child => {
            if((child as THREE.Mesh).isMesh && !target2Mesh) {
                target2Mesh = child as THREE.Mesh;
            }
        });

        if(target2Mesh) {
            console.log("Found mesh 2. Sampling points...");
            const sampler = new MeshSurfaceSampler(target2Mesh).build();
            const tempPosition = new THREE.Vector3();

            for(let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                sampler.sample(tempPosition);

                const model2Scale = 15;

                model2Positions[i3 + 0] = tempPosition.x * model2Scale;
                model2Positions[i3 + 1] = tempPosition.y * model2Scale;
                model2Positions[i3 + 2] = tempPosition.z * model2Scale;
            }

            console.log("Model 2 sampling complete! Cache filled.");

            gltf.scene.visible = false;
        }
    }, undefined, (error) => {
        console.error("An error happened while loading the model:", error);
    });


    //Model 2
    const model3Url = new URL(
        "../../public/assets/newModels/lola_bunny/scene.gltf", 
        import.meta.url
    ).href;

    const loader3 = new GLTFLoader();
    loader3.load(model3Url, (gltf) => {
        let target3Mesh: THREE.Mesh | null = null;
        gltf.scene.traverse(child => {
            if((child as THREE.Mesh).isMesh && !target3Mesh) {
                target3Mesh = child as THREE.Mesh;
            }
        });

        if(target3Mesh) {
            console.log("Found mesh 3. Sampling points...");
            const sampler = new MeshSurfaceSampler(target3Mesh).build();
            const tempPosition = new THREE.Vector3();

            for(let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                sampler.sample(tempPosition);

                const model3Scale = 15;

                model3Positions[i3 + 0] = tempPosition.x * model3Scale;
                model3Positions[i3 + 1] = tempPosition.y * model3Scale;
                model3Positions[i3 + 2] = tempPosition.z * model3Scale;
            }

            console.log("Model 3 sampling complete! Cache filled.");

            gltf.scene.visible = false;
        }
    }, undefined, (error) => {
        console.error("An error happened while loading the model:", error);
    });


    //Model 4
    const model4Url = new URL(
        "../../public/assets/newModels/l-39za_art_albatros/scene.gltf", 
        import.meta.url
    ).href;

    const loader4 = new GLTFLoader();
    loader4.load(model4Url, (gltf) => {
        let targetMesh: THREE.Mesh | null = null;
        gltf.scene.traverse(child => {
            if((child as THREE.Mesh).isMesh && !targetMesh) {
                targetMesh = child as THREE.Mesh;
            }
        });

        if(targetMesh) {
            console.log("Found mesh 4. Sampling points...");
            const sampler = new MeshSurfaceSampler(targetMesh).build();
            const tempPosition = new THREE.Vector3();

            for(let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                sampler.sample(tempPosition);

                const modelScale = 33;
                
                const yOffset = 130;
                const zOffset = 20;

                model4Positions[i3 + 0] = tempPosition.x * modelScale;
                model4Positions[i3 + 1] = (tempPosition.y * modelScale) + yOffset;
                model4Positions[i3 + 2] = (tempPosition.z * modelScale) + zOffset;
            }

            console.log("Model 4 sampling complete! Cache filled.");

            gltf.scene.visible = false;
        }
    }, undefined, (error) => {
        console.error("An error happened while loading the model:", error);
    });


    //Model 5
    const model5Url = new URL(
        "../../public/assets/newModels/black_bikini_studio_portrait/scene.gltf", 
        import.meta.url
    ).href;

    const loader5 = new GLTFLoader();
    loader5.load(model5Url, (gltf) => {
        let targetMesh: THREE.Mesh | null = null;
        gltf.scene.traverse(child => {
            if((child as THREE.Mesh).isMesh && !targetMesh) {
                targetMesh = child as THREE.Mesh;
            }
        });

        if(targetMesh) {
            console.log("Found mesh 5. Sampling points...");
            const sampler = new MeshSurfaceSampler(targetMesh).build();
            const tempPosition = new THREE.Vector3();

            for(let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                sampler.sample(tempPosition);

                const modelScale = .002;

                const yOffset = -20;
                const xOffset = -5;

                model5Positions[i3 + 0] = tempPosition.x * modelScale;
                model5Positions[i3 + 1] = (tempPosition.y * modelScale) + yOffset;
                model5Positions[i3 + 2] = tempPosition.z * modelScale;
            }

            console.log("Model 5 sampling complete! Cache filled.");

            gltf.scene.visible = false;
        }
    }, undefined, (error) => {
        console.error("An error happened while loading the model:", error);
    });


    //Model 6
    const model6Url = new URL(
        "../../public/assets/newModels/2020_volvo_v60_t8_polestar_engineered/scene.gltf", 
        import.meta.url
    ).href;

    const loader6 = new GLTFLoader();
    loader6.load(model6Url, (gltf) => {
        let targetMesh: THREE.Mesh | null = null;
        gltf.scene.traverse(child => {
            if((child as THREE.Mesh).isMesh && !targetMesh) {
                targetMesh = child as THREE.Mesh;
            }
        });

        if(targetMesh) {
            console.log("Found mesh 6. Sampling points...");
            const sampler = new MeshSurfaceSampler(targetMesh).build();
            const tempPosition = new THREE.Vector3();

            for(let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                sampler.sample(tempPosition);

                const modelScale = 10;

                const yOffset = -15;

                model6Positions[i3 + 0] = tempPosition.x * modelScale;
                model6Positions[i3 + 1] = (tempPosition.y * modelScale) + yOffset;
                model6Positions[i3 + 2] = tempPosition.z * modelScale;
            }

            console.log("Model 6 sampling complete! Cache filled.");

            gltf.scene.visible = false;
        }
    }, undefined, (error) => {
        console.error("An error happened while loading the model:", error);
    });


    const animate = () => {
        requestAnimationFrame(animate);

        const positionAttr = particleGeometry.attributes.position.array as Float32Array;
        const time = window.performance.now() * 0.001;

        let targetCache = gridPositions;
        if(shapes[shapeIndex] === "sphere") targetCache = spherePositions;
        if(shapes[shapeIndex] === "model") targetCache = modelPositions;
        if(shapes[shapeIndex] === "model2") targetCache = model2Positions;
        if(shapes[shapeIndex] === "model3") targetCache = model3Positions;
        if(shapes[shapeIndex] === "model4") targetCache = model4Positions;
        if(shapes[shapeIndex] === "model5") targetCache = model5Positions;
        if(shapes[shapeIndex] === "model6") targetCache = model6Positions;

        const lerpSpeed = 0.05;

        for(let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            const curX = positionAttr[i3 + 0];
            const curY = positionAttr[i3 + 1];
            const curZ = positionAttr[i3 + 2];

            const tarX = targetCache[i3 + 0];
            const tarY = targetCache[i3 + 1];
            const tarZ = targetCache[i3 + 2];

            positionAttr[i3 + 0] = curX + (tarX - curX) * lerpSpeed;
            positionAttr[i3 + 1] = curY + (tarY - curY) * lerpSpeed;
            positionAttr[i3 + 2] = curZ + (tarZ - curZ) * lerpSpeed;
        }

        particleGeometry.attributes.position.needsUpdate = true;

        particleSystem.rotation.y += 0.002;

        composer.render();
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });
})
