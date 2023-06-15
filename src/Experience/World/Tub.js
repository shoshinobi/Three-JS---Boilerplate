import * as THREE from "three";
import Experience from "../Experience";

export default class Tub {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;


    // Setup
    this.resource = this.resources.items.tubModel;
    this.setModel();
  }

  /*------------------ Methods -----------------*/

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(.5,.5,.5);
    this.model.position.set(0.01,0.385,-1.77);
    this.scene.add(this.model);
    this.model.receiveShadow = true;

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  

  
}
