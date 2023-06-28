import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;

    // Debug
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Renderer");
    }

    this.setInstance();
    this.resize();
  }

  /*------------------ Methods -----------------*/
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });

    //Lighting
    this.instance.physicallyCorrectLights = true;

    // Gamma Correction
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.outputEncoding = THREE.sRGBEncoding;

    // Tone Mapping (ACEC Filmic, sRGB, Uncharted, Cineon, None, Custom, etc.)
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.75;

    // Shadows
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;

    // Cavas Sizes
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    // Background Color
    this.instance.setClearColor(0x181513, 1);

    // Debug Parameters
    if (this.debug.active) {
      // Background Clear Color
      this.instance.clearColor = "0x000000";
      this.debugFolder.addColor(this.instance, "clearColor").onChange(() => {
        this.instance.setClearColor(this.instance.clearColor, 1);
      });
    }
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
