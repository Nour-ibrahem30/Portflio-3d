import * as THREE from 'three';

export function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  camera.position.z = 5;

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 3000;
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x6366f1,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Geometric shapes
  const geometry1 = new THREE.TorusGeometry(1, 0.3, 16, 100);
  const material1 = new THREE.MeshStandardMaterial({ 
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const torus = new THREE.Mesh(geometry1, material1);
  torus.position.set(-3, 2, -5);
  scene.add(torus);

  const geometry2 = new THREE.IcosahedronGeometry(1, 0);
  const material2 = new THREE.MeshStandardMaterial({ 
    color: 0xec4899,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const icosahedron = new THREE.Mesh(geometry2, material2);
  icosahedron.position.set(3, -2, -5);
  scene.add(icosahedron);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x6366f1, 2);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xec4899, 2);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);

  // Mouse movement
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation
  function animate() {
    requestAnimationFrame(animate);

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    icosahedron.rotation.x -= 0.01;
    icosahedron.rotation.y -= 0.01;

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
