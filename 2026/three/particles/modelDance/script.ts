import * as THREE from "three";
import { EffectComposer, FilmPass, GLTFLoader, MeshSurfaceSampler, RenderPass } from "three/examples/jsm/Addons.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

    if(!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize(width, height);

    const particleCount = 15000;

    const currentPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);

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

    const filmPass = new FilmPass(0.15, false);
    composer.addPass(filmPass);

    let mixer: THREE.AnimationMixer | null = null;
    let sampler: MeshSurfaceSampler | null = null;
    let targetMesh: THREE.Mesh | null = null as THREE.Mesh | null;
    const clock = new THREE.Timer();

    const danceUrl = new URL(
        "../../public/assets/animated/Snake Hip Hop Dance/Snake Hip Hop Dance.gltf",
        import.meta.url
    ).href;

    const loader = new GLTFLoader();

    // loader.load(danceUrl, (gltf) => {
    //     scene.add(gltf.scene);

    //     mixer = new THREE.AnimationMixer(gltf.scene);

    //     if(gltf.animations.length > 0) {
    //         console.log("Animations found:", gltf.animations);
    //         const action = mixer.clipAction(gltf.animations[0]);
    //         action.play();
    //     } else {
    //         console.warn("No animations found inside this GLTF file!");
    //     }

    //     // gltf.scene.visible = false;
    //     gltf.scene.traverse((child) => {
    //         if((child as THREE.Mesh).isMesh) {
    //             const mesh = child as THREE.Mesh;
    //             mesh.material = new THREE.MeshBasicMaterial({
    //                 transparent: true,
    //                 opacity: 0,
    //                 depthWrite: false
    //             })
    //         }
    //     });

    //     gltf.scene.traverse(child => {
    //         if((child as THREE.Mesh).isMesh && !targetMesh) {
    //             targetMesh = child as THREE.Mesh;
    //         }
    //     });

    //     if(targetMesh) {
    //         console.log("Found mesh. Sampling points...");

    //         // (targetMesh as THREE.Mesh).frustumCulled = false;
    //         // if((targetMesh as any).isSkinnedMesh) {
    //         //     (targetMesh as any).matrixAutoUpdate = true;
    //         // }
    //         sampler = new MeshSurfaceSampler(targetMesh).build();

    //         const tempPosition = new THREE.Vector3();
    //         const modelScale = .15;

    //         for(let i = 0; i < particleCount; i++) {
    //             const i3 = i * 3;

    //             sampler.sample(tempPosition);

    //             const yOffset = -13;

    //             currentPositions[i3 + 0] = tempPosition.x * modelScale;
    //             currentPositions[i3 + 1] = (tempPosition.y * modelScale) + yOffset;
    //             currentPositions[i3 + 2] = tempPosition.z * modelScale;
    //         }

    //         particleGeometry.attributes.position.needsUpdate = true;
    //         console.log("Model sampling complete! Cache filled.");
    //     }
    // }, undefined, (error) => {
    //     console.error("An error happened while loading the model:", error);
    // });

    let vertexCount = 0;
    loader.load(danceUrl, (gltf) => {
        scene.add(gltf.scene);

        mixer = new THREE.AnimationMixer(gltf.scene);
        if(gltf.animations.length > 0) {
            mixer.clipAction(gltf.animations[0]).play();
        }

        gltf.scene.traverse((child) => {
            if((child as THREE.Mesh).isMesh) {
                // Force visibility for material trick
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: 0,
                    depthWrite: false
                });
                if(!targetMesh) targetMesh = mesh;
            }
        });

        if(targetMesh) {
            // Find out exactly how many vertices this model has
            const positionAttr = targetMesh.geometry.attributes.position;
            vertexCount = positionAttr.count;
            console.log(`Tracking ${vertexCount} animated vertices!`);
        }
    }, undefined, (error) => {
        console.error("An error happened while loading the model:", error);
    });

    const tempPosition = new THREE.Vector3;
    const lerpSpeed = 0.15;
    const loopScale = 0.15;
    const loopYOffset = -13;

    // const animate = () => {
    //     requestAnimationFrame(animate);

    //     const delta = clock.getDelta();
    //     if(mixer) mixer.update(delta);

    //     const positionAttr = particleGeometry.attributes.position.array as Float32Array;

    //     if(sampler && targetMesh) {
    //         for(let i = 0; i < particleCount; i++) {
    //             const i3 = i * 3;

    //             sampler.sample(tempPosition);

    //             tempPosition.x *= loopScale;
    //             tempPosition.y *= loopScale;
    //             tempPosition.z *= loopScale;

    //             tempPosition.y += loopYOffset;

    //             tempPosition.applyMatrix4((targetMesh as THREE.Mesh).matrixWorld);

    //             targetPositions[i3 + 0] = tempPosition.x;
    //             targetPositions[i3 + 1] = tempPosition.y;
    //             targetPositions[i3 + 2] = tempPosition.z;

    //             const curX = positionAttr[i3 + 0];
    //             const curY = positionAttr[i3 + 1];
    //             const curZ = positionAttr[i3 + 2];

    //             const tarX = targetPositions[i3 + 0];
    //             const tarY = targetPositions[i3 + 1];
    //             const tarZ = targetPositions[i3 + 2];

    //             positionAttr[i3 + 0] = curX + (tarX - curX) * lerpSpeed;
    //             positionAttr[i3 + 1] = curY + (tarY - curY) * lerpSpeed;
    //             positionAttr[i3 + 2] = curZ + (tarZ - curZ) * lerpSpeed;
    //         }
    //         particleGeometry.attributes.position.needsUpdate = true;
    //     }

    //     particleSystem.rotation.y += 0.002;
    //     composer.render();
    // };

    const animate = () => {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        if(mixer) mixer.update(delta);

        const positionAttr = particleGeometry.attributes.position.array as Float32Array;

        // Ensure targetMesh has loaded and is a SkinnedMesh
        if(targetMesh && (targetMesh as any).isSkinnedMesh) {
            const skinnedMesh = targetMesh as any;

            // Loop through your particles up to the maximum available vertices
            for(let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Wrap around if particleCount is larger than model vertices
                const vertexIndex = i % vertexCount; 

                // 🕺 MAGIC LINE: Pulls the exact live animated vertex position from the bone
                skinnedMesh.applyBoneTransform(vertexIndex, tempPosition);

                // Apply your scale and offset locally
                tempPosition.x *= loopScale;
                tempPosition.y *= loopScale;
                tempPosition.z *= loopScale;
                tempPosition.y += loopYOffset;

                // Move into global world coordinates
                tempPosition.applyMatrix4(targetMesh.matrixWorld);

                targetPositions[i3 + 0] = tempPosition.x;
                targetPositions[i3 + 1] = tempPosition.y;
                targetPositions[i3 + 2] = tempPosition.z;

                // Smoothly lerp your particles to the live vertex targets
                positionAttr[i3 + 0] += (targetPositions[i3 + 0] - positionAttr[i3 + 0]) * lerpSpeed;
                positionAttr[i3 + 1] += (targetPositions[i3 + 1] - positionAttr[i3 + 1]) * lerpSpeed;
                positionAttr[i3 + 2] += (targetPositions[i3 + 2] - positionAttr[i3 + 2]) * lerpSpeed;
            }
            particleGeometry.attributes.position.needsUpdate = true;
        }

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
});