export function sayHello() {
  alert("Hello from JS!");
}

window.threeInterop = {
  initializeScene: function (canvasId) {
    // Get the canvas element by ID
    const canvas = document.getElementById(canvasId);

    // Create a new Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );

    // Create the WebGL renderer and attach it to the canvas
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Create a cube and add it to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Set the camera position
    camera.position.z = 5;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Rotate the cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // Render the scene with the camera
      renderer.render(scene, camera);
    }

    // Start the animation loop
    animate();
  },
};
