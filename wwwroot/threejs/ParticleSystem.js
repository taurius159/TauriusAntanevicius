export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.particleCount = 2; // Start with 2 particles

    this.initializeParticles();
  }

  initializeParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10; // X position
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // Y position
      positions[i * 3 + 2] = 0; // Z position (2D)
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
    });
    this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particleSystem);
  }

  update() {
    // Optional: Update particle positions here if needed
  }
}
