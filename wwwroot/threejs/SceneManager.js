export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const frustumSize = 50;

    this.camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );

    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.animate = false;
    this.particleSystem = null;

    window.addEventListener("resize", () => this.onWindowResize());
  }

  async initializeParticles() {
    const { ParticleSystem } = await import("./particleSystem.js");
    this.particleSystem = new ParticleSystem(this.scene);
  }

  render() {
    if (this.animate && this.particleSystem) {
      this.particleSystem.update();
    }
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    const frustumSize = 50;

    this.camera.left = (frustumSize * aspect) / -2;
    this.camera.right = (frustumSize * aspect) / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = frustumSize / -2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  startAnimation() {
    this.animate = true;
  }
}
