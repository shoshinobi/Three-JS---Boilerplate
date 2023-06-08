import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
    constructor() {

        // Extending the EventEmitter constructor
        super();

        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        // Tick
        window.requestAnimationFrame(() => {
            this.tick();
        });

    }

    /*------------------ Methods -----------------*/

    tick() {
        const currentTime =Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        // Emit the event
        this.trigger('tick')
        
        // Update
        window.requestAnimationFrame(() => {
            this.tick();
        });
    }


}
