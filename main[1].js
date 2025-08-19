// Minimal Three.js globe with graceful fallback
(() => {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    function resize() {
      const { clientWidth: w, clientHeight: h } = canvas;
      renderer.setSize(w, h, false);
      camera.aspect = w / h || 1;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(-2, 1, 2);
    scene.add(ambient, dir);

    // Earth
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const texLoader = new THREE.TextureLoader();

    // Night texture hosted with permissive CORS; if it fails, we use a dark material.
    const NIGHT_URL = 'https://unpkg.com/three-globe@2.32.1/example/img/earth-night.jpg';

    let mat = new THREE.MeshStandardMaterial({
      color: 0x0e131a,
      roughness: 1.0,
      metalness: 0.0
    });

    texLoader.load(
      NIGHT_URL,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 1.0,
          metalness: 0.0
        });
        mesh.material = mat;
      },
      undefined,
      () => { /* ignore errors; fallback stays */ }
    );

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Slight tilt and offset to mimic example composition
    mesh.rotation.x = 0.25;
    scene.position.x = 0.35;

    // Animate
    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.0009;
      renderer.render(scene, camera);
    }

    resize();
    animate();
  } catch (e) {
    console.warn('WebGL init failed; using CSS fallback.', e);
    // Nothing else to do; CSS fallback covers it.
  }
})();
