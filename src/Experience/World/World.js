import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Fox from "./Fox.js";
import Portal from "./Portal.js";
import Tub from "./Tub.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

   

    // Wait for resources
    this.resources.on("ready", () => {
      console.log("~Resources are ready");

      // Setup the world scene
      //this.floor = new Floor();
      this.fox = new Fox();
      this.portal = new Portal();
      this.tub = new Tub();

      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
