// Eiffel Tower coordinates
const EIFFEL_TOWER_LAT = 48.8584;
const EIFFEL_TOWER_LON = 2.2945;

// Convert lat/lon to 3D coordinates (simplified version)
function latLonToXYZ(lat, lon, radius = 100) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    
    return { x, y, z };
}

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000033);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Get container and set renderer size
const container = document.getElementById('geo-container');
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create Earth sphere
const earthGeometry = new THREE.SphereGeometry(100, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Add Eiffel Tower marker
const markerGeometry = new THREE.ConeGeometry(2, 8, 16);
const markerMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const marker = new THREE.Mesh(markerGeometry, markerMaterial);

// Position marker at Eiffel Tower coordinates
const position = latLonToXYZ(EIFFEL_TOWER_LAT, EIFFEL_TOWER_LON, 100);
marker.position.set(position.x, position.y, position.z);
marker.lookAt(0, 0, 0);
scene.add(marker);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Set camera position
camera.position.set(0, 0, 200);
camera.lookAt(position.x, position.y, position.z);

// Add orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(position.x, position.y, position.z);

// Handle window resize
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Start animation when the page is loaded
window.addEventListener('load', () => {
    animate();
}); 