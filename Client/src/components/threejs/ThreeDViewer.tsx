import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDViewer = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Khởi tạo scene, camera, renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(400, 400);

        // Thêm renderer vào DOM
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        // Thêm 1 hình khối mẫu (Box)
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 3;

        // Animation loop
        const animate = () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            renderer.dispose();
            if (mountRef.current) {
                mountRef.current.innerHTML = '';
            }
        };
    }, []);

    return <div ref={mountRef} />;
};

export default ThreeDViewer;