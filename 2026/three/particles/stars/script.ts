import * as THREE from "three";
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

    if(!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // const ctx = canvas.getContext('2d');
    // if(!ctx) return;
    // // ctx.fillStyle = "lightblue";
    // // ctx.fillRect(0,0,width,height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    // BLUE CUBE
    // const geometry = new THREE.BoxGeometry(12, 12, 12);
    // const material = new THREE.MeshBasicMaterial({ color: "blue", wireframe: false });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    const particleCount = 5000;
    const position = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
        // scatter between -25 and 25 space units
        position[i] = (Math.random() - 0.5) * 50;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true // Makes particles further appear smaller
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(width, height);

    const animate = () => {
        requestAnimationFrame(animate);

        // BLUE CUBE ROTATION
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;

        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;
        
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});