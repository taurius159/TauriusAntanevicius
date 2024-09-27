window.initializeGame = function (canvasId) {
  let canvas = document.getElementById(canvasId);
  let scene, camera, renderer;
  let player,
    platforms = [],
    orbs = [],
    npcs = [];
  let collectedOrbs = 0;
  let moveLeft = false,
    moveRight = false,
    isJumping = false;
  let velocity = new THREE.Vector3();
  const gravity = 0.01;
  const jumpSpeed = 0.2;
  const moveSpeed = 0.1;

  // Initialize the Three.js game
  function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);

    // Create renderer and attach to the Blazor-provided canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(canvas.width, canvas.height);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Create the player
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff6699 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, 2, 0); // Start position
    scene.add(player);

    // Create ground platform
    createPlatform(0, -1, 20, 1);

    // Add more platforms
    createPlatform(-5, 2, 5, 1);
    createPlatform(5, 4, 5, 1);
    createPlatform(-10, 6, 5, 1);

    // Add orbs (light orbs representing God's love)
    for (let i = 0; i < 3; i++) {
      const orb = createOrb();
      orb.position.set(Math.random() * 10 - 5, 4 + i * 2, 0);
      scene.add(orb);
      orbs.push(orb);
    }

    // Add NPCs (representing others in need of love)
    for (let i = 0; i < 2; i++) {
      const npc = createNPC();
      npc.position.set(i * 10 - 5, 1.5 + i * 2, 0);
      scene.add(npc);
      npcs.push(npc);
    }

    // Handle user input (A, D for movement, Space for jump)
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Start the animation loop
    animate();
  }

  // Create a platform
  function createPlatform(x, y, width, height) {
    const geometry = new THREE.BoxGeometry(width, height, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const platform = new THREE.Mesh(geometry, material);
    platform.position.set(x, y, 0);
    scene.add(platform);
    platforms.push(platform);
  }

  // Create an orb (God's love)
  function createOrb() {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    return new THREE.Mesh(geometry, material);
  }

  // Create an NPC (others in need of love)
  function createNPC() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x555555 });
    return new THREE.Mesh(geometry, material);
  }

  // Handle key down events for movement
  function onKeyDown(event) {
    switch (event.code) {
      case "KeyA":
        moveLeft = true;
        break;
      case "KeyD":
        moveRight = true;
        break;
      case "Space":
        if (!isJumping) {
          velocity.y = jumpSpeed;
          isJumping = true;
        }
        break;
    }
  }

  // Handle key up events to stop movement
  function onKeyUp(event) {
    switch (event.code) {
      case "KeyA":
        moveLeft = false;
        break;
      case "KeyD":
        moveRight = false;
        break;
    }
  }

  // Check collisions with platforms
  function checkPlatformCollision() {
    let onGround = false;
    platforms.forEach((platform) => {
      const dist = player.position.distanceTo(platform.position);
      const platformTop = platform.position.y + 0.5; // Top surface of the platform
      if (
        dist < platform.geometry.parameters.width / 2 + 0.5 &&
        player.position.y <= platformTop + 0.5
      ) {
        player.position.y = platformTop + 0.5; // Place player on top of the platform
        velocity.y = 0;
        isJumping = false;
        onGround = true;
      }
    });

    if (!onGround) {
      velocity.y -= gravity; // Apply gravity
    }
  }

  // Check if player collects an orb
  function checkOrbCollision() {
    orbs.forEach((orb, index) => {
      if (player.position.distanceTo(orb.position) < 1) {
        scene.remove(orb);
        orbs.splice(index, 1);
        collectedOrbs++;
      }
    });
  }

  // Check if player shares love with an NPC
  function checkNPCCollision() {
    npcs.forEach((npc, index) => {
      if (player.position.distanceTo(npc.position) < 1 && collectedOrbs > 0) {
        npc.material.color.set(0xff6699); // Brighten the NPC
        npcs.splice(index, 1);
        collectedOrbs--;
      }
    });

    // Check if all NPCs are brightened
    if (npcs.length === 0) {
      alert("You shared God's love with everyone!");
    }
  }

  // Update player movement based on key inputs
  function updateMovement() {
    if (moveLeft) {
      player.position.x -= moveSpeed;
    }
    if (moveRight) {
      player.position.x += moveSpeed;
    }

    // Apply gravity and jumping velocity
    player.position.y += velocity.y;

    // Check collisions
    checkPlatformCollision();
    checkOrbCollision();
    checkNPCCollision();

    // Update camera to follow player
    camera.position.x = player.position.x;
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
  }

  // Start the game initialization
  init();
};
