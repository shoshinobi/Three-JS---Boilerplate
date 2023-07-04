import * as dat from "lil-gui";
import Stats from 'stats.js';


export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.gui = new dat.GUI();

      // Stats Monitor
      const stats = new Stats();
      stats.showPanel(0)
      document.body.appendChild(stats.dom)

     
    }
  }
}
