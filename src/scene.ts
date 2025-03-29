import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export function initScene(): void {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0e68c); // Warna latar belakang cerah

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("three-canvas") as HTMLCanvasElement,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Tambahkan Pencahayaan
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Buat Amplop (Bagian bawah)
    const envelopeGeometry = new THREE.BoxGeometry(2.5, 1.5, 0.1);
    const envelopeMaterial = new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.5, roughness: 0.3 });
    const envelope = new THREE.Mesh(envelopeGeometry, envelopeMaterial);
    envelope.position.set(0, -0.5, -3);
    scene.add(envelope);

    // Buat Penutup Amplop (Bagian atas yang akan terbuka)
    const lidGeometry = new THREE.BoxGeometry(2.5, 1.2, 0.1);
    const lidMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.5, roughness: 0.3 });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.set(0, 0.2, -3);
    scene.add(lid);

    // Buat Surat di dalam Amplop
    const letterGeometry = new THREE.BoxGeometry(2.3, 1.4, 0.05);
    const letterMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const letter = new THREE.Mesh(letterGeometry, letterMaterial);
    letter.position.set(0, -0.6, -2.9);
    letter.visible = false;
    scene.add(letter);

    let isOpened = false;

    // Tambahkan Teks "Happy Eid Mubarak"
    const loaderFont = new FontLoader();
    loaderFont.load("https://threejs.org/examples/fonts/helvetiker_bold.typeface.json", (font) => {
        const textGeometry = new TextGeometry("happy aid ", {
            font: font,
            size: 0.2,
            depth: 0.05,
        });

        const textMaterial = new THREE.MeshStandardMaterial({ color: 0x008000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.set(-1, -0.5, -2.8);
        textMesh.visible = false;
        scene.add(textMesh);

        // Event Klik Amplop -> Animasikan Pembukaan
        window.addEventListener("click", () => {
            if (!isOpened) {
                let openSpeed = 0.02;
                function openAnimation() {
                    if (lid.rotation.x > -Math.PI / 2) {
                        lid.rotation.x -= openSpeed;
                        requestAnimationFrame(openAnimation);
                    } else {
                        letter.visible = true;
                        textMesh.visible = true;
                        isOpened = true;
                    }
                    renderer.render(scene, camera);
                }
                openAnimation();
            }
        });
    });

    // Loop Animasi
    function animate(): void {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
    animate();
}
