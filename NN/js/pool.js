// @ts-check
"use strict";
/*
var Que = require('que.js').Que;
var Ball = require('que.js').Ball;
var Hole = require('hole.js').Hole;
var Table = require('table.js').Table;
var NeuralNetwork = require('neuralnetwork/nn.js').NeuralNetwork;
*/
const GENERATIONSIZE = 10;
const DONE = 0;
const AIMING = 1;
const STRIKING = 2;
const ROLLING = 3;

class Pool {

    constructor(w, h, progressCallback) {
        this.progressCallback = progressCallback;
        this.width = w;
        this.height = h;
        this.whiteBall = null;
        this.redBall = null;
        this.hole = null;
        this.table = null;
        this.ques = [];
        this.que = null;
        this.savedQues = null;

        this.state = 0;
        this.generation = 0;
        this.queIndex = 0;
        this.lastScore = 0;
        this.bestScore = 0;
        this.learning = true;
        this.averageScore = 0;

        this.gamesPlayed = 0;
        this.gamesWon = 0;
    }

    init(play) {
        this.table = new Table();
        this.placeItems();

        if (play === true) {
            // let queBrain = NeuralNetwork.deserialize(brainJSON);
            let queBrain = null
            this.que = new Que(queBrain);
            this.ques.push(this.que);
            this.learning = false;
            this.queIndex = 0;
            this.que = this.ques[this.queIndex];
            this.state = DONE;
        }
        else {
            this.newGeneration();
        }

    }

    thinkDone()
    {
        this.state = STRIKING;
    }

    tick() {
        if (this.state === DONE) {
            this.que.moveTo(this.whiteBall.pos.x, this.whiteBall.pos.y);
            this.que.thinkPython(this.whiteBall, this.redBall, this.hole, this.thinkDone);
            this.state = AIMING
            // this.que.think(this.whiteBall, this.redBall, this.hole);
            // this.state = STRIKING;
        }
        else if (this.state === AIMING)
        {
            // just wait
        }
        else if (this.state === STRIKING) {
            this.que.force -= 0.01;
            if (this.que.force <= 0) {
                this.whiteBall.addForce(this.que.getForce());
                this.que.force = 0;
                this.state = ROLLING;
            }
        }
        else if (this.state === ROLLING) {
            if (this.whiteBall.isStopped() && this.redBall.isStopped()) {
                this.queDone();
            }
            else if (this.hole.score(this.whiteBall)) {
                this.que.whitePotted = true;
                this.queDone();
            }
            else if (this.hole.score(this.redBall)) {
                this.que.redPotted = true;
                this.queDone();
            }
            else if (this.que.ballsHit) {
                this.que.updateScore(this.hole, this.redBall);
            }
        }

        this.whiteBall.update();
        this.redBall.update();
        this.table.checkCollisions(this.whiteBall);
        this.table.checkCollisions(this.redBall);

        this.checkBallCollisions();
    }

    placeItems() {
        var padding = 50;
        var y = random(padding, this.height - 2 * padding);
        this.whiteBall = new Ball(100, y, 10, true);
        y = random(padding, this.height - 2 * padding);
        this.redBall = new Ball(this.width / 2, y, 10, false);
        y = random(padding, this.height - 2 * padding);
        this.hole = new Hole(this.width - 100, y, 15);
    }

    newGeneration() {
        if (this.generation == 0) {
            this.ques = [];
            for (let i = 0; i < GENERATIONSIZE; i++) {
                this.que = new Que(null);
                this.ques.push(this.que);
            }
        }
        else {
            this.savedQues = this.ques;

            this.calculateFitness();
            for (let i = 0; i < GENERATIONSIZE; i++) {
                this.que[i] = this.pickOne();
            }

        }

        this.generation++;
        this.queIndex = 0;
        this.que = this.ques[this.queIndex];
        this.state = DONE;

        this.progressCallback(this.generation, this.averageScore);
    }

    calculateFitness() {
        let sum = 0;
        for (let q of this.savedQues) {
            sum += q.score;
        }
        this.averageScore = sum / this.savedQues.length;

        for (let q of this.savedQues) {
            q.fitness = q.score / sum;
        }
    }

    pickOne() {
        let index = 0;
        let r = random(1);
        while (r > 0) {
            r = r - this.savedQues[index].fitness;
            index++;
        }

        index--;
        let q = this.savedQues[index];
        if (q.score === 0) {
            let child = new Que(q.brain);
            child.mutate();
            return child;
        }
        else {
            let child = new Que();
            return child;
        }
    }

    checkBallCollisions() {
        const ball1 = this.whiteBall;
        const ball2 = this.redBall;

        var dist = this.whiteBall.pos.dist(this.redBall.pos);
        if (dist <= this.whiteBall.r + this.redBall.r) {
            console.log("Ball hit !");

            var power = (Math.abs(ball1.vel.x) + Math.abs(ball1.vel.y)) +
                (Math.abs(ball2.vel.x) + Math.abs(ball2.vel.y));
            power = power * 0.00482;

            var opposite = ball1.pos.y - ball2.pos.y;
            var adjacent = ball1.pos.x - ball2.pos.x;
            var rotation = Math.atan2(opposite, adjacent);

            ball1.moving = true;
            ball2.moving = true;

            var velocity2 = createVector(90 * Math.cos(rotation + PI) * power, 90 * Math.sin(rotation + PI) * power);
            ball2.addForce(velocity2);
            ball2.acc.mult(0.97);

            var velocity1 = createVector(90 * Math.cos(rotation) * power, 90 * Math.sin(rotation) * power);
            ball1.addForce(velocity1);
            ball1.acc.mult(0.97);

            this.que.ballsHit = true;
        }
    }

    queDone() {
        if (this.learning) {
            this.lastScore = this.que.calcScore(this.hole, this.redBall);
            if (this.lastScore > this.bestScore) {
                this.bestScore = this.lastScore;
            }

            this.queIndex++;
            if (this.queIndex >= GENERATIONSIZE) {
                this.placeItems();
                this.newGeneration();
            }

            this.que = this.ques[this.queIndex];
            this.whiteBall.reset();
            this.redBall.reset();
            this.state = DONE;
        }
        else {
            this.gamesPlayed++;
            if (this.que.redPotted)
                this.gamesWon++;
            this.que.resetResults();
            this.placeItems();
            this.state = DONE;
        }

    }
}

if (typeof module !== 'undefined') {
    module.exports = Pool;
}