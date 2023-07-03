import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// bloom post processing
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export default class PostProcess {
  constructor(renderer, scene, camera, sizes) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.sizes = sizes;

    this.setComposer();
  }

  /*------------------ Methods -----------------*/
  setComposer() {
    this.effectComposer = new EffectComposer(this.renderer);

    // Add render pass
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.effectComposer.addPass(this.renderPass);

    // Add post-processing effects
    this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(this.sizes.width, this.sizes.height),
        1.5,
        0.4,
        0.85
    );
    this.bloomPass.threshold = 0;
    this.bloomPass.strength = 1.5;
    this.bloomPass.radius = 1;
    this.effectComposer.addPass(this.bloomPass);

  }

  render() {
      this.effectComposer.render();
  }
}