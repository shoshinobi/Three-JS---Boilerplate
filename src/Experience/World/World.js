import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./objects/Floor.js";
import Fox from "./objects/Fox.js";
import Portal from "./objects/Portal.js";
import Fireflies from "./objects/Fireflies.js";


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
      this.fireFlies = new Fireflies();

      this.environment = new Environment();
    });
  }

  update() {
    // Update Fox
    if (this.fox) this.fox.update();
    

    // Update Materials
    if (this.fireFlies) this.fireFlies.update();

    // Update Portal
    if (this.portal) this.portal.update();
    

   

  }
}
