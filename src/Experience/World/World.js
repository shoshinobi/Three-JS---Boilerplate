import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Fox from "./Fox.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Test mesh
    // const testMesh = new THREE.Mesh(
    //     new THREE.BoxGeometry(1, 1, 1),
    //     new THREE.MeshStandardMaterial(
    //     {
    //         color: 0xcccccc,
    //         wireframe: false,
    //     })
    // )
    // this.scene.add(testMesh)

    // Wait for resources
    this.resources.on("ready", () => {
      console.log("~Resources are ready");

      // Setup the world scene
      this.floor = new Floor();
      this.fox = new Fox();

      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
