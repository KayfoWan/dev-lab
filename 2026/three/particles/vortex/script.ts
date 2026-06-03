import * as THREE from "three";
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

    if(!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    // const particleCount = 5000;
    // const position = new Float32Array(particleCount * 3);
    
    // for (let i = 0; i < particleCount * 3; i++) {
    //     // scatter between -25 and 25 space units
    //     position[i] = (Math.random() - 0.5) * 50;
    // }

    // const particleGeometry = new THREE.BufferGeometry();
    // particleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    // const particleMaterial = new THREE.PointsMaterial({
    //     size: 0.1,
    //     color: 0xffffff,
    //     transparent: true,
    //     opacity: 0.8,
    //     sizeAttenuation: true // Makes particles further appear smaller
    // });

    // const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    // scene.add(particleSystem);

    const particleCount = 10000;
    const position = new Float32Array(particleCount * 3);
    
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);

    for(let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        const radius = Math.pow(Math.random(), 2) * 30;
        const angle = Math.random() * Math.PI * 2

        radii[i] = radius;
        angles[i] = angle;

        position[i3 + 0] = Math.cos(angle) * radius;
        position[i3 + 1] = (Math.random() - 0.5) * 2;
        position[i3 + 2] = Math.sin(angle) * radius;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: "hotpink",
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    particleSystem.rotation.x = Math.PI * 0.5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(width, height);

    const animate = () => {
        requestAnimationFrame(animate);

        const positionAttr = particleGeometry.attributes.position.array as Float32Array;

        for(let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = radii[i];
            const orbitSpeed = 0.05 / (radius + 1);
            angles[i] += orbitSpeed;
            radii[i] -= 0.01;
            if(radii[i] < 0.5) {
                radii[i] = 30;
            }

            positionAttr[i3 + 0] = Math.cos(angles[i]) * radii[i];
            positionAttr[i3 + 2] = Math.sin(angles[i]) * radii[i];
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