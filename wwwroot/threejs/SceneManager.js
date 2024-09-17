export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;

    // Calculate aspect ratio and set up an orthographic camera for 2D view
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const frustumSize = 100; // Arbitrary size for the 2D plane

    this.camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2, // left
      (frustumSize * aspect) / 2, // right
      frustumSize / 2, // top
      frustumSize / -2, // bottom
      0.1, // near plane
      1000 // far plane
    );

    // Position the camera to look directly down at the 2D plane
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);

    // Create the scene
    this.scene = new THREE.Scene();

    // Set up the WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Set up lighting
    this.setupLighting();

    // Set up the 2D plane (optional grid)
    this.setup2DPlane();

    // Add window resize listener
    window.addEventListener("resize", () => this.onWindowResize());
  }

  setupLighting() {
    // Ambient light for basic illumination
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    this.scene.add(ambientLight);

    // Optional: Add a directional light to simulate a light source from above
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 10).normalize();
    this.scene.add(directionalLight);
  }

  setup2DPlane() {
    // Create a grid helper to visualize the 2D space (optional)
    const gridHelper = new THREE.GridHelper(100, 10);
    this.scene.add(gridHelper);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    const frustumSize = 100;

    this.camera.left = (frustumSize * aspect) / -2;
    this.camera.right = (frustumSize * aspect) / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = frustumSize / -2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }
}
