// @ts-check
"use strict";

class Que {
    constructor(brain) {

        /*let input1 = random();
        let input2 = random();

        this.angle = map(input1, 0, 1, 0, PI);
        this.force = map(input2, 0, 1, 0.5, 1);*/
        this.angle = 0;
        this.force = 0;
        this.initialForce = 0;

        this.resetResults();

        /*
        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(6, 8, 2);
        }*/
    }

    postAjax(url, data, success) {

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () { 
            if (xhr.readyState == 4 && xhr.status == 200) {
                var json = JSON.parse(xhr.responseText);
                this.angle = json.angle;
                this.force = json.force
                this.initialForce = this.force;
                success();
            }
        };

        var jsonstring = JSON.stringify(data);
        xhr.send(jsonstring);
        return xhr;
    }

    thinkPython(whiteBall, redBall, hole, doneCallback) {
        let data = {}
        data.whiteBall ={ x: whiteBall.pos.x, y: whiteBall.pos.y }
        data.redBall ={ x: redBall.pos.x, y: redBall.pos.y }
        data.hole ={ x: hole.pos.x, y: hole.pos.y }
        this.postAjax("/predict", data, doneCallback)
    }

    think(whiteBall, redBall, hole) {
        let inputs = [];
        inputs[0] = whiteBall.pos.x / width;
        inputs[1] = whiteBall.pos.y / height;
        inputs[2] = redBall.pos.x / width;
        inputs[3] = redBall.pos.y / height;
        inputs[4] = hole.pos.x / width;
        inputs[5] = hole.pos.y / height;
        let output = this.brain.predict(inputs);
        // console.log(output);
        this.angle = map(output[0], 0, 1, 0, PI);
        this.force = map(output[1], 0, 1, 0.5, 1);
        this.initialForce = this.force;
    }

    resetResults()
    {
        this.ballsHit = false;
        this.redPotted = false;
        this.whitePotted = false;
        this.score = 0;
        this.closestDistance = width;
    }

    mutate() {
        this.brain.mutate(0.1);
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    getForce() {
        let w = p5.Vector.fromAngle(this.angle - PI / 2);
        w.setMag(this.initialForce * 10);
        return w;
    }

    updateScore(hole, ball) {
        var dist = ball.pos.dist(hole.pos);
        if (dist < this.closestDistance) {
            this.closestDistance = dist;
        }
    }

    calcScore() {
        if (this.redPotted) {
            this.score = 1
        }
        else if (this.whitePotted) {
            this.score = 0;
        }
        else if (this.ballsHit === false) {
            this.score = 0;
        }
        else {
            this.score = 1 - (this.closestDistance / width);
        }

        return this.score;
    }

    draw() {
        strokeWeight(8);
        stroke(150, 75, 0);

        let v = createVector(this.x, this.y);
        let w = p5.Vector.fromAngle(this.angle - PI / 2);
        w.setMag(15 + (this.force > 0 ? 20 : 0));
        let p1 = p5.Vector.sub(v, w);
        w.setMag(100);
        let p2 = p5.Vector.sub(v, w);

        line(p1.x, p1.y, p2.x, p2.y);

        strokeWeight(1);
    }
}

if (typeof module !== 'undefined') {
    module.exports = Que;
}