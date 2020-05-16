// @ts-check
"use strict";

class Table {
    constructor() {
        this.lines = [];

        this.lines.push({ x1: 5, y1: 5, x2: width - 5, y2: 5 });
        this.lines.push({ x1: width - 5, y1: height - 5, x2: width - 5, y2: 5 });
        this.lines.push({ x1: 5, y1: height - 5, x2: width - 5, y2: height - 5 });
        this.lines.push({ x1: 5, y1: height - 5, x2: 5, y2: 5 });
    }

    draw() {
        stroke(8, 64, 27);
        noFill();
        strokeWeight(3);
        for (let part of this.lines) {
            line(part.x1, part.y1, part.x2, part.y2);
        }

        strokeWeight(1);
    }

    update() {

    }

    checkCollisions(ball) {

        // horizontal lines
        let part = this.lines[0];  // top
        if (this.lineCircle(part.x1, part.y1, part.x2, part.y2, ball.pos.x, ball.pos.y, ball.r)) {
            ball.vel.y *= -1;
            ball.pos.y = part.y1 + ball.r;
            return;
        }

        part = this.lines[2];   // bottom
        if (this.lineCircle(part.x1, part.y1, part.x2, part.y2, ball.pos.x, ball.pos.y, ball.r)) {
            ball.vel.y *= -1;
            ball.pos.y = part.y1 - ball.r;
            return;
        }

        // vertical borders
        part = this.lines[1];   // right
        if (this.lineCircle(part.x1, part.y1, part.x2, part.y2, ball.pos.x, ball.pos.y, ball.r)) {
            ball.vel.x *= -1;
            ball.pos.x = part.x1 - ball.r;
            return;
        }

        part = this.lines[3];   // left
        if (this.lineCircle(part.x1, part.y1, part.x2, part.y2, ball.pos.x, ball.pos.y, ball.r)) {
            ball.vel.x *= -1;
            ball.pos.x = part.x1 + ball.r;
            return;
        }
    }

    lineCircle(x1, y1, x2, y2, xc, yc, rc) {
        var ac = [xc - x1, yc - y1];
        var ab = [x2 - x1, y2 - y1];
        var ab2 = this.dot(ab, ab);
        var acab = this.dot(ac, ab);
        var t = acab / ab2;
        t = (t < 0) ? 0 : t;
        t = (t > 1) ? 1 : t;
        var h = [(ab[0] * t + x1) - xc, (ab[1] * t + y1) - yc];
        var h2 = this.dot(h, h);
        return h2 <= rc * rc;
    }

    dot(v1, v2) {
        return (v1[0] * v2[0]) + (v1[1] * v2[1]);
    }
}

if (typeof module !== 'undefined') {
    module.exports = Table;
}