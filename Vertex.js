import { Vector3 } from 'three';


// Play around with these as desired

// Affects momentum
const bounce = 0.999;
// Adds a horizontal force
const wind = 0;
// Changes how tightly bound the net is
const friction = 0.995;


export class Vertex {

    constructor(x, y, z, locked) {

        this.position = new Vector3(x, y, z);
        this.prevPosition;
        this.locked = locked
        this.defaultColor = 0xffffff;

        this.setPreviousPosition(x, y, z);

    }

    //-------------------------------------------------------


    /*
    *   Return point to n-1 for sequential formula
    */
    setPreviousPosition(prevX, prevY, prevZ) {
        this.prevPosition = new Vector3(prevX, prevY, prevZ);
    }

    //-------------------------------------------------------

    updatePoint(delta, gravity) {

        if (!this.locked) {

            // calculate velocity
            var vx = (this.position.x - this.prevPosition.x) * friction;
            var vy = (this.position.y - this.prevPosition.y) * friction;
            var vz = (this.position.z - this.prevPosition.z) * friction;
            // update positional velocity
            this.prevPosition.x = this.position.x;
            this.prevPosition.y = this.position.y;
            this.prevPosition.z = this.position.z;
            // apply velocity to coordinates
            this.position.x += vx; 
            this.position.y += vy;
            this.position.z += vz;
            // apply forces
            var g = gravity;
            g = g / (1000/30);
            this.position.y += g * delta;
            var w = wind;
            this.position.z += w * delta;

        }

    }


    /**
     * 
     * constrains vertices from moving out of bounds of the scene
     * 
     */
    constrainPoint(sceneW, sceneH) {

        // Locked points tether net
        if (!this.locked) {

            var vx = (this.position.x - this.prevPosition.x) * friction;
            var vy = (this.position.y - this.prevPosition.y) * friction;

            if (this.position.x > sceneW / 2) {
                this.position.x = sceneW / 2;
                this.prevPosition.x = this.position.x + vx * bounce;
            }
            else if (this.position.x < -sceneW / 2) {
                this.position.x = -sceneW / 2;
                this.prevPosition.x = this.position.x + vx * bounce;
            }

            if (this.position.y > sceneH / 2) {
                this.position.y = sceneH / 2;
                this.prevPosition.y = this.position.y + vy * bounce;
            }
            else if (this.position.y < -sceneH / 2) {
                this.position.y = -sceneH / 2;
                this.prevPosition.y = this.position.y + vy * bounce;
            }

        }

    }

    //

    toggleLocked() {
        
        this.locked = !this.locked;

        this.updateColor();
        
    }

    //

    updateColor() {

        if (this.locked) {
            this.defaultColor = 0xff5382;
        }
        else {
            this.defaultColor = 0xffffff;
        }

    }
}