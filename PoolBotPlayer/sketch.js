// @ts-check

//import {Pool} from './pool.js';

let brainJSON = null;
let pool;

function preload() {
    // brainJSON = loadJSON("../PoolBot/json8/poolBrain-G448-0954.json");
    // brainJSON = loadJSON("poolBrain-G10-0423.json");    // 0.4227
    // brainJSON = loadJSON("poolBrain-69.json"); // 0.8015
    // brainJSON = loadJSON("poolBrain-G10-0529.json");
    //brainJSON = loadJSON("poolBrain-G294-0977.json");
    // brainJSON = loadJSON("poolBrain-G936-098.json");
    // brainJSON = loadJSON("poolBrain-G479-0965.json");
    // brainJSON = loadJSON("poolBrain-G925-098.json");    // 0.9768
    // brainJSON = loadJSON("poolBrain-749.json");
    //brainJSON = loadJSON("poolBrain-577.json");
    // brainJSON = loadJSON("poolBrain-626.json");
    // brainJSON = loadJSON("poolBrain-686.json"); // 0.9587
    // brainJSON = loadJSON("poolBrain-113-094.json");
    brainJSON = loadJSON("poolBrain-G204-0977.json"); // 0.977
}   

function setup() {
    var canvas = createCanvas(600, 300);
    canvas.parent("canvas-parent");

    colorMode(HSB);
    colorMode(RGB);
    textAlign(LEFT, TOP);

    pool = new Pool(width, height, progress);
    pool.init(brainJSON);
}

function progress(gen, average) {

}

function draw() {
    pool.tick();
    show();
}

function show() {
    background(23, 147, 79);

    pool.table.draw();
    pool.hole.draw();
    pool.whiteBall.draw();
    pool.redBall.draw();
    pool.que.draw();

    noStroke();
    fill(255);
    textSize(18);
    textStyle(NORMAL);

    text("Angle:", 20, 20);
    text("Force:", 20, 40);
    text("Score:", 20, 60);
    textStyle(BOLD);
    text(format(degrees(pool.que.angle)) + "°", 100, 20);
    text(format(pool.que.initialForce), 100, 40);
    text(pool.gamesWon + ' / ' + pool.gamesPlayed, 100, 60);

    /*
    text("Generation:", 20, 20);
    text("Current:", 20, 40);
    text("Last/Best/Avg:", 20, 60);

    textStyle(BOLD);
    text(pool.generation, 140, 20);
    text((pool.queIndex + 1) + " / " + GENERATIONSIZE, 140, 40);
    text(format(pool.lastScore) + " / " + format(pool.bestScore)+ " / " + format(pool.averageScore), 140, 60);*/
}

function format(value) {
    return Math.ceil(value * 1000) / 1000;
}
