let scene, camera, renderer, cube;

function initializeGodsWord(canvasId) {
  import("./SceneManager.js").then(({ SceneManager }) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    sceneManager = new SceneManager(canvas);
    sceneManager.initializeParticles().then(() => {
      animate();
    });

    startAnimation();

    function animate() {
      requestAnimationFrame(animate);
      if (sceneManager) {
        sceneManager.render();
      }
    }
  });
}

function startAnimation() {
  if (sceneManager) {
    sceneManager.startAnimation();
  }
}
