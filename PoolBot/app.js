// @ts-check
"use strict";

global.width = 600;
global.height = 300;

// Dummy Functions
function stroke(r, g, b) { }
function line(x1, y1, x2, y2) { }
function ellipse(x, y, r) { }
function strokeWeight(w) { }
function noFill() { }
function fill(r, g, b) { }
function noStroke() { }

function random(min, max) {
    var rand;

    rand = Math.random();
    if (typeof min === 'undefined') {
        return rand;
    } else if (typeof max === 'undefined') {
        if (min instanceof Array) {
            return min[Math.floor(rand * min.length)];
        } else {
            return rand * min;
        }
    } else {
        if (min > max) {
            var tmp = min;
            min = max;
            max = tmp;
        }

        return rand * (max - min) + min;
    }
}

let previous;
let y2;
function randomGaussian(mean, sd) {
    var y1, x1, x2, w;
    if (previous) {
        y1 = y2;
        previous = false;
    } else {
        do {
            x1 = random(2) - 1;
            x2 = random(2) - 1;
            w = x1 * x1 + x2 * x2;
        } while (w >= 1);
        w = Math.sqrt(-2 * Math.log(w) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        previous = true;
    }

    var m = mean || 0;
    var s = sd || 1;
    return y1 * s + m;
}

function format(value) {
    return Math.ceil(value * 10000) / 10000;
}
function formatScore(value) {
    let s = '0000' + Math.ceil(value * 1000);
    return s.substr(s.length - 4);
}

function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}

function map(n, start1, stop1, start2, stop2, withinBounds) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return this.constrain(newval, start2, stop2);
    } else {
        return this.constrain(newval, stop2, start2);
    }
}

function loadJson(fileName)
{
    var data = fs.readFileSync(fileName, 'utf8');
    return data;
}

global.random = random;
global.randomGaussian = randomGaussian;
global.map = map;
global.stroke = stroke;
global.line = line;
global.ellipse = ellipse;
global.strokeWeight = strokeWeight;
global.noFill = noFill;
global.fill = fill;
global.noStroke = noStroke;

let maxGenerations = 1000;

var Pool = require('./pool');
const fs = require('fs');

let initialBrain  = null;
let initialBrainFile = "../PoolBotPlayer/poolBrain-G936-098.json";
// comment next line to start learning from scratch
// initialBrain = loadJson(initialBrainFile);

let poolGame = new Pool(global.width, global.height, progress);
poolGame.init(null, initialBrain);
let bestSave = 0;
let done = false;


function progress(gen, avg, best, json) {
    let subFolder = "json10";
    let logfileName = './' + subFolder + '/log.txt';
    let msg = "Generation:\t" + gen + "\tAverage Score:\t" + format(avg) + "\tBest score:\t" + format(best);
    console.log(msg);
    msg = gen + "\t" + format(avg) + "\t" + format(best);
    if (fs.existsSync(logfileName) === false) {
        fs.appendFileSync(logfileName, "Generation\tAverage\tBest" + "\r\n");
    }

    fs.appendFileSync(logfileName, msg + "\r\n");

    if (gen > maxGenerations) {
        done = true;
    }

    let save = false;
    if (best > 0.9 && best > bestSave) {
        save = true;
        bestSave = best;
    }

    if ((save || gen === 10 || (gen % 100) === 0) && json !== null) {
        let filename = './' + subFolder + '/poolBrain-G' + gen + '-' + formatScore(best) + '.json';
        fs.writeFileSync(filename, json);
        console.log("The file was saved: " + filename);
        // done = true;
    }
}

while (done === false) {
    poolGame.tick();
}
