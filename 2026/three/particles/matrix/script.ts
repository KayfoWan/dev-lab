import * as THREE from "three";
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

    if(!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    const particleCount = 5000;
    const position = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Scatter between -30 and 30 (camera view) (X)
        position[i3 + 0] = (Math.random() - 0.5) * 60;
        
        // Scatter between 0 and 40 (Y)
        position[i3 + 1] = Math.random() * 40;

        // Scatter between -15 and 15 (Z)
        position[i3 + 2] = (Math.random() - 0.5) * 30;

        speeds[i] = 0.1 + Math.random() * 0.4;
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

    const animate = () => {
        requestAnimationFrame(animate);

        const positionAttr = particleGeometry.attributes.position.array as Float32Array;
        for(let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positionAttr[i3 + 1] -= speeds[i];

            if(positionAttr[i3 + 1] < -20) {
                positionAttr[i3 + 1] = 20;
            }
        }

        particleGeometry.attributes.position.needsUpdate = true;
        
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});