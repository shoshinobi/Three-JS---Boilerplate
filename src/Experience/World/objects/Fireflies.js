import * as THREE from "three";
import Experience from "../../Experience.js";
import firefliesVertexShader from "../shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "../shaders/fireflies/fragment.glsl";

export default class Fireflies {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    // this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Fireflies");
    }

    // Setup
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  /*------------------ Methods -----------------*/

  setGeometry() {
    this.firefliesGeometry = new THREE.BufferGeometry();
    const firefliesCount = 60;
    const positionArray = new Float32Array(firefliesCount * 3);
    const scaleArray = new Float32Array(firefliesCount);

    for (let i = 0; i < firefliesCount; i++) {
      positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
      positionArray[i * 3 + 1] = Math.random() * 1.6;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

      scaleArray[i] = Math.random();
    }

    this.firefliesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    this.firefliesGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleArray, 1)
    )
  }

  setMaterial() {
    this.firefliesMaterial = new THREE.ShaderMaterial({
      vertexShader: firefliesVertexShader,
      fragmentShader: firefliesFragmentShader,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.firefliesMaterial.uniforms.uSize, "value")
        .min(0)
        .max(500)
        .step(1)
        .name("fireFliesSize");
    }
  }

  setMesh() {
    this.fireflies = new THREE.Points(
      this.firefliesGeometry,
      this.firefliesMaterial
    );
    this.scene.add(this.fireflies);
  }
}
