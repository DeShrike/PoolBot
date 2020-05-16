// @ts-check
"use strict";

var Vector2 = require('./vector2.js');
var NeuralNetwork = require('./nn.js');

class Que {
    constructor(brain) {

        /*let input1 = random();
        let input2 = random();

        this.angle = map(input1, 0, 1, 0, PI);
        this.force = map(input2, 0, 1, 0.5, 1);*/
        this.angle = 0;
        this.force = 0;
        this.initialForce = 0;

        this.ballsHit = false;
        this.redPotted = false;
        this.whitePotted = false;
        this.totalScore = 0;
        this.closestDistance = global.width;
        this.gamesPlayed = 0;

        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(6, 18, 2);
        }
    }

    copy() {
        var c = new Que(this.brain);
        c.ballsHit = this.ballsHit;
        c.redPotted = this.redPotted;
        c.whitePotted = this.whitePotted;
        c.totalScore = this.totalScore;
        c.gamesPlayed = this.gamesPlayed;
        c.closestDistance = this.closestDistance;
        return c;
    }

    think(whiteBall, redBall, hole) {
        let inputs = [];
        inputs[0] = whiteBall.pos.x / global.width;
        inputs[1] = whiteBall.pos.y / global.height;
        inputs[2] = redBall.pos.x / global.width;
        inputs[3] = redBall.pos.y / global.height;
        inputs[4] = hole.pos.x / global.width;
        inputs[5] = hole.pos.y / global.height;
        let output = this.brain.predict(inputs);
        this.angle = global.map(output[0], 0, 1, 0, Math.PI);
        this.force = global.map(output[1], 0, 1, 0.5, 1);
        this.initialForce = this.force;
    }

    mutate() {
        this.brain.mutate(0.10);
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    getForce() {
        let w = Vector2.fromAngle(this.angle - Math.PI / 2);
        w.setMag(this.initialForce * 10);
        return w;
    }

    updateScore(hole, ball) {
        var dist = ball.pos.dist(hole.pos);
        if (dist < this.closestDistance) {
            this.closestDistance = dist;
        }
    }

    applyScore() {
        let score = 0;
        if (this.redPotted) {
            score = 1
        }
        else if (this.whitePotted) {
            score = 0;
        }
        else if (this.ballsHit === false) {
            score = 0;
        }
        else {
            score = (1 - (this.closestDistance / global.width)) ;
        }

        this.totalScore += score;
        this.gamesPlayed++;

        this.redPotted = false;
        this.whitePotted = false;
        this.ballsHit = false;
        this.closestDistance = global.width;

        return this.totalScore / this.gamesPlayed;
    }

    draw() {
        global.strokeWeight(8);
        global.stroke(150, 75, 0);

        let v = new Vector2(this.x, this.y);
        let w = Vector2.fromAngle(this.angle - Math.PI / 2);
        w.setMag(15 + (this.force > 0 ? 20 : 0));
        let p1 = Vector2.sub(v, w);
        w.setMag(100);
        let p2 = Vector2.sub(v, w);

        global.line(p1.x, p1.y, p2.x, p2.y);

        global.strokeWeight(1);
    }
}

if (typeof module !== 'undefined') {
    module.exports = Que;
}
