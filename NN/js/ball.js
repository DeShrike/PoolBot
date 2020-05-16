// @ts-check
"use strict";

class Ball {
    constructor(x, y, r, isWhite) {
        this.pos = createVector(x, y);
        this.r = r;
        this.isWhite = isWhite;
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.friction = 0.007;
        this.mass = 1;
        this.startx = x;
        this.starty=y;
    }

    draw() {
        noStroke();
        if (this.isWhite) {
            fill(255);
        }
        else {
            fill(255, 0, 0);
        }

        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    reset()
    {
        this.pos.x= this.startx;
        this.pos.y=this.starty;
        this.vel.mult(0);
        this.acc.mult(0);
    }

    isStopped() {
        return this.vel.mag() < 0.1;
    }

    addForce(force) {
        this.acc = force;
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        // friction
        this.vel.setMag(this.vel.mag() * (1 - this.friction));
    }
}

if (typeof module !== 'undefined') {
    module.exports = Ball;
}