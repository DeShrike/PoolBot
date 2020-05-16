// @ts-check
"use strict";

var Que = require('./que.js');
var Ball = require('./ball.js');
var Hole = require('./hole.js');
var Table = require('./table.js');
var NeuralNetwork = require('./nn.js');
var Vector2 = require('./vector2.js');

const GENERATIONSIZE = 100;
const GAMES = 100;          // number of games each genertion has to play
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
        this.bestScore = 0;
        this.bestBrainJSON = null;

        this.initalBrain = null;        // for kickstarting a learning session
    }

    init(brainJSON, initialJSON) {

        if (initialJSON !== null) {
            this.initalBrain = NeuralNetwork.deserialize(initialJSON);
        }

        this.table = new Table(this.width, this.height);
        this.placeItems();

        if (brainJSON != null) {
            let queBrain = NeuralNetwork.deserialize(brainJSON);
            this.que = new Que(queBrain);
            this.ques.push(this.que);
            this.learning = false;
        }
        else {
            this.newGeneration();
        }

    }

    loadJson(fileName) {
        
    }

    tick() {
        if (this.state === AIMING) {
            this.que.moveTo(this.whiteBall.pos.x, this.whiteBall.pos.y);
            this.que.think(this.whiteBall, this.redBall, this.hole);
            this.state = STRIKING;
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
        // this.table.checkCollisions(this.whiteBall);
        // this.table.checkCollisions(this.redBall);

        this.checkBallCollisions();
    }

    placeItems() {
        var padding = 50;
        var y = global.random(padding, this.height - 2 * padding);
        this.whiteBall = new Ball(100, y, 10, true);
        y = global.random(padding, this.height - 2 * padding);
        this.redBall = new Ball(this.width / 2, y, 10, false);
        y = global.random(padding, this.height - 2 * padding);
        this.hole = new Hole(this.width - 100, y, 15);
    }

    newGeneration() {
        this.bestBrainJSON = null;
        if (this.generation == 0) {
            this.ques = [];
            for (let i = 0; i < GENERATIONSIZE; i++) {
                this.que = new Que(this.initalBrain);
                this.ques.push(this.que);
            }
        }
        else {

            // console.log("newGen");
            this.savedQues = [];

            for (let i = 0; i < this.ques.length; i++) {
                var q = this.ques[i].copy();
                this.savedQues.push(q);
            }

            this.calculateFitness();
            for (let i = 0; i < GENERATIONSIZE; i++) {
                this.ques[i] = this.pickOne();
            }

        }

        this.generation++;
        this.queIndex = 0;
        this.que = this.ques[this.queIndex];
        this.state = AIMING;

        this.progressCallback(this.generation, this.averageScore, this.bestScore, this.bestBrainJSON);
    }

    calculateFitness() {
        this.bestScore = 0;
        let sum = 0;
        for (let q of this.savedQues) {
            sum += q.totalScore / q.gamesPlayed;
            if (q.totalScore / q.gamesPlayed > this.bestScore) {
                this.bestScore = q.totalScore / q.gamesPlayed;
                this.bestBrainJSON = q.brain.serialize();
            }
        }
        this.averageScore = sum / this.savedQues.length;

        for (let q of this.savedQues) {
            q.fitness = (q.totalScore / q.gamesPlayed) / sum;
            // console.log("Fitnes: " + q.fitness);
        }
    }

    pickOne() {
        let index = 0;
        let r = global.random(0, 1);
        // console.log("R: " + r);
        while (r > 0) {
            // console.log(" - " + this.savedQues[index].fitness);
            r = r - this.savedQues[index].fitness;
            // console.log(" = " + r);
            index++;
        }

        index--;
        // console.log(index);
        let q = this.savedQues[index];
        // if (q.totalScore !== 0) {
        let child = new Que(q.brain);
        child.mutate();
        return child;
        /*}
        else {
            let child = new Que();
            return child;
        }*/
    }

    checkBallCollisions() {
        const ball1 = this.whiteBall;
        const ball2 = this.redBall;

        var dist = this.whiteBall.pos.dist(this.redBall.pos);
        if (dist <= this.whiteBall.r + this.redBall.r) {

            var power = (Math.abs(ball1.vel.x) + Math.abs(ball1.vel.y)) +
                (Math.abs(ball2.vel.x) + Math.abs(ball2.vel.y));
            power = power * 0.00482;

            var opposite = ball1.pos.y - ball2.pos.y;
            var adjacent = ball1.pos.x - ball2.pos.x;
            var rotation = Math.atan2(opposite, adjacent);

            // ball1.moving = true;
            // ball2.moving = true;

            var velocity2 = new Vector2(90 * Math.cos(rotation + Math.PI) * power, 90 * Math.sin(rotation + Math.PI) * power);
            ball2.addForce(velocity2);
            ball2.acc.mult(0.97);

            var velocity1 = new Vector2(90 * Math.cos(rotation) * power, 90 * Math.sin(rotation) * power);
            ball1.addForce(velocity1);
            ball1.acc.mult(0.97);

            this.que.ballsHit = true;
        }
    }

    queDone() {
        if (this.learning) {

            this.lastScore = this.que.applyScore(this.hole, this.redBall);
            if (this.lastScore > this.bestScore) {
                this.bestScore = this.lastScore;
            }

            if (this.que.gamesPlayed >= GAMES) {
                this.queIndex++;
                // console.log("Que " + this.queIndex);

                if (this.queIndex >= GENERATIONSIZE) {
                    this.queIndex = 0;
                    this.newGeneration();
                }
            }

            this.placeItems();

            this.que = this.ques[this.queIndex];
            this.state = AIMING;

            // console.log("Game " + this.currentGame + " Que " + this.queIndex);
            // console.log("Best " + this.bestScore + " Last " + this.lastScore);
        }
        else {
            this.placeItems();
            this.state = AIMING;
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = Pool;
}
