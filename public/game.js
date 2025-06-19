let scene, camera, renderer, controls, cube, clock;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  controls = new THREE.PointerLockControls(camera, document.body);
  document.body.addEventListener('click', () => controls.lock());

  clock = new THREE.Clock();
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  document.getElementById('time').textContent = clock.elapsedTime.toFixed(1);
  cube.rotation.x += delta;
  cube.rotation.y += delta;
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
