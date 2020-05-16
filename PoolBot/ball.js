// @ts-check
"use strict";

var Vector2 = require('./vector2.js');

class Ball {
    constructor(x, y, r, isWhite) {
        this.pos = new Vector2(x, y);
        this.r = r;
        this.isWhite = isWhite;
        this.vel = new Vector2(0, 0);
        this.acc = new Vector2(0, 0);
        this.friction = 0.005;
        this.mass = 1;
        this.startx = x;
        this.starty = y;
    }

    draw() {
        global.noStroke();
        if (this.isWhite) {
            global.fill(255);
        }
        else {
            global.fill(255, 0, 0);
        }

        global.ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    reset() {
        this.pos.x = this.startx;
        this.pos.y = this.starty;
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
