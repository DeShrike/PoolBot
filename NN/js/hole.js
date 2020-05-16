// @ts-check
"use strict";

class Hole {
    constructor(x, y, r) {
        this.pos = createVector(x, y);
        this.r = r;
    }

    draw() {
        stroke(8, 200, 27);
        fill(0);

        ellipse(this.pos.x, this.pos.y, this.r * 2);
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
