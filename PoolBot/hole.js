// @ts-check
"use strict";

var Vector2 = require('./vector2.js');

class Hole {
    constructor(x, y, r) {
        this.pos = new Vector2(x, y);
        this.r = r;
    }

    draw() {
        global.stroke(255);
        global.fill(0);

        global.ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    score(ball)
    {
        let dist = this.pos.dist(ball.pos);
        return dist < this.r;
    }

    update() {

    }
}

if (typeof module !== 'undefined') {
    module.exports = Hole;
}
