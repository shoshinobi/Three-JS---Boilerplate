import * as THREE from "three";
import Experience from "../../Experience.js";
import portalVertexShader from "../shaders/portal/vertex.glsl";
import portalFragmentShader from "../shaders/portal/fragment.glsl";

export default class Portal {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Portal");
    }

    // Setup
    this.resource = this.resources.items.portalModel;
    this.setModel();
    this.setTextures();
    this.setMaterials();
    //this.setAnimation();
  }

  /*------------------ Methods -----------------*/

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(1, 1, 1);
    // this.model.rotation.y = Math.PI * 0.5
    this.scene.add(this.model);
    this.model.receiveShadow = true;

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
      }
    });
  }

  setTextures() {
    this.bakedTexture = this.resources.items.portalTexture;
    this.bakedTexture.flipY = false;
    this.bakedTexture.encoding = THREE.sRGBEncoding;
  }

  setMaterials() {
    // Baked Material
    this.bakedMaterial = new THREE.MeshBasicMaterial({
      map: this.bakedTexture,
    });

    // Add baked material to all child meshes

    // if multiple meshes need the material
    //
    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     child.material = this.bakedMaterial;
    //   }
    // });

    // Or If all meshes are merged into one
    const portalSceneMesh = this.model.children.find(
      (child) => child.name === "portalScene"
    );
    portalSceneMesh.material = this.bakedMaterial;

    // Find the light pole and portal meshes
    const portalMesh = this.model.children.find(
      (child) => child.name === "portal"
    );
    const lampGlassMeshA = this.model.children.find(
      (child) => child.name === "lampGlass"
    );
    const lampGlassMeshB = this.model.children.find(
      (child) => child.name === "lampGlass002"
    );

    // Light pole emission materials
    this.poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xd4bd7f });
    lampGlassMeshA.material = this.poleLightMaterial;
    lampGlassMeshB.material = this.poleLightMaterial;

    // Portal emission material
    this.portalColorStart = "#fef5ff";
    this.portalColorEnd = "#d0b0c0";

    this.portalLightMaterial = new THREE.ShaderMaterial({
      vertexShader: portalVertexShader,
      fragmentShader: portalFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColorStart: {
          value: new THREE.Color(this.portalColorStart),
        },
        uColorEnd: { 
          value: new THREE.Color(this.portalColorEnd) },
      },
    });

    portalMesh.material = this.portalLightMaterial;

    // Debug
    if (this.debug.active) {
      // Lamp post light color
      this.debugFolder
        .addColor(this.poleLightMaterial, "color")
        .onChange(() => {
          this.poleLightMaterial.color.set(this.poleLightMaterial.color);
        })
        .name("PoleLightColor");

      // Portal light color
      this.debugFolder
        .addColor(this.portalLightMaterial.uniforms.uColorStart, "value")
        .onChange(() => {
          this.portalLightMaterial.uniforms.uColorStart.value.set(
            this.portalLightMaterial.uniforms.uColorStart.value
          );
        })
        .name("PortalColorStart");
      this.debugFolder
        .addColor(this.portalLightMaterial.uniforms.uColorEnd, "value")
        .onChange(() => {
          this.portalLightMaterial.uniforms.uColorEnd.value.set(
            this.portalLightMaterial.uniforms.uColorEnd.value
          );
        })
        .name("PortalColorEnd");
    }
  }

  //Update
  update() {
    this.portalLightMaterial.uniforms.uTime.value = this.time.elapsed * 0.001;
  }
}
