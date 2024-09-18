// Particle class - to be exported later
class Particle {
  constructor(x, y, z, goodness) {
    this.geometry = new THREE.SphereGeometry(0.1, 32, 32);
    this.material = new THREE.MeshBasicMaterial({
      color: this.getColor(goodness),
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(x, y, z);
    this.goodness = goodness;
    this.influenceRadius = 1.0;
    this.collisionTimer = 0;

    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      0
    );
  }

  getColor(goodness) {
    const red = 255;
    const green = Math.floor(255 * (goodness / 100));
    const blue = Math.floor(255 * (goodness / 100));
    return new THREE.Color(`rgb(${red},${green},${blue})`);
  }

  updateGoodness(delta) {
    this.goodness = Math.max(0, Math.min(100, this.goodness + delta));
    this.material.color = this.getColor(this.goodness);
  }

  interactWith(other) {
    const distance = this.mesh.position.distanceTo(other.mesh.position);
    if (distance < this.influenceRadius) {
      const influence = (this.goodness - other.goodness) * 0.01;
      other.updateGoodness(influence);
      this.updateGoodness(-influence);
    }
  }

  handleCollision(other) {
    if (this.checkCollision(other)) {
      const influence = (this.goodness - other.goodness) * 0.05;
      other.updateGoodness(influence);
      this.updateGoodness(-influence);

      // Bounce effect
      const tempVelocity = this.velocity.clone();
      this.velocity.copy(other.velocity);
      other.velocity.copy(tempVelocity);

      // Occasionally linger together
      if (Math.random() < 0.1) {
        this.velocity.multiplyScalar(0.5);
        other.velocity.multiplyScalar(0.5);
      }

      // Set collision timer to a random value between 1 and 3 seconds
      this.collisionTimer = Math.random() * 2 + 1;
      other.collisionTimer = Math.random() * 2 + 1;
    }
  }

  checkCollision(other) {
    const distance = this.mesh.position.distanceTo(other.mesh.position);
    const combinedRadius =
      this.geometry.parameters.radius + other.geometry.parameters.radius;
    return distance < combinedRadius;
  }

  updatePosition(width, height, deltaTime = 0.016) {
    this.mesh.position.add(this.velocity);

    // Decrement collision timer
    if (this.collisionTimer > 0) {
      this.collisionTimer -= deltaTime;
      if (this.collisionTimer <= 0) {
        // Separate particles by applying a small random velocity
        this.velocity.add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            0
          )
        );
      }
    }

    // Convert canvas dimensions to Three.js coordinate system
    const aspectRatio = width / height;
    const halfHeight =
      Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const halfWidth = halfHeight * aspectRatio;

    // Bounce from edges
    const radius = this.geometry.parameters.radius;

    if (this.mesh.position.x - radius <= -halfWidth) {
      this.velocity.x = Math.abs(this.velocity.x); // Ensure velocity is positive
      this.mesh.position.x = -halfWidth + radius;
    } else if (this.mesh.position.x + radius >= halfWidth) {
      this.velocity.x = -Math.abs(this.velocity.x); // Ensure velocity is negative
      this.mesh.position.x = halfWidth - radius;
    }

    if (this.mesh.position.y - radius <= -halfHeight) {
      this.velocity.y = Math.abs(this.velocity.y); // Ensure velocity is positive
      this.mesh.position.y = -halfHeight + radius;
    } else if (this.mesh.position.y + radius >= halfHeight) {
      this.velocity.y = -Math.abs(this.velocity.y); // Ensure velocity is negative
      this.mesh.position.y = halfHeight - radius;
    }
  }
}

// Game class

let camera, scene, renderer, player;
const particles = [];

function initializeGame(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  camera.position.z = 5;

  // Create player particle
  player = new Particle(0, 0, 0, 50);
  scene.add(player.mesh);

  // Create other particles
  for (let i = 0; i < 10; i++) {
    const goodness = Math.random() * 100;
    const particle = new Particle(
      Math.random() * 4 - 2,
      Math.random() * 4 - 2,
      0,
      goodness
    );
    particles.push(particle);
    scene.add(particle.mesh);
  }

  function animate() {
    requestAnimationFrame(animate);

    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;

    // Update particles
    particles.forEach((particle) => {
      particle.updatePosition(width, height);
      particles.forEach((other) => {
        if (particle !== other) {
          particle.interactWith(other);
          particle.handleCollision(other);
        }
      });
    });

    renderer.render(scene, camera);
  }
  animate();
}

function onMouseMove(event) {
  const canvas = renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
  vector.unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));

  player.mesh.position.copy(pos);
}

window.addEventListener("mousemove", onMouseMove);
