let scene, camera, renderer, cube;

function initializeThreeJS(canvasId) {
  import("./SceneManager.js").then(({ SceneManager }) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    sceneManager = new SceneManager(canvas);
    animate();

    function animate() {
      requestAnimationFrame(animate);
      sceneManager.render();
    }
  });
}
