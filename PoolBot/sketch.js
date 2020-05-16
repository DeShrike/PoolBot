// @ts-check

//import {Pool} from './pool.js';

let brainJSON = null;
let pool;

function preload() {
    // brainJSON = loadJSON("best_que.json");
}

function setup() {
    var canvas = createCanvas(600, 300);
    canvas.parent("canvas-parent");

    colorMode(HSB);
    colorMode(RGB);
    textAlign(LEFT, TOP);

    pool = new Pool(width, height, progress);
    pool.init(brainJSON);

    global.width = 600;
    global.height = 300;

    global.stroke = stroke;
    global.line = line;
    global.ellipse = ellipse;
    global.strokeWeight = strokeWeight;
    global.noFill = noFill;
    global.fill = fill;
    global.noStroke = noStroke;
    global.random = random;
    global.map = map;
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
    text("Generation:", 20, 20);
    text("Current:", 20, 40);
    text("Last/Best/Avg:", 20, 60);

    textStyle(BOLD);
    text(pool.generation, 140, 20);
    text((pool.queIndex + 1) + " / " + GENERATIONSIZE, 140, 40);
    text(format(pool.lastScore) + " / " + format(pool.bestScore)+ " / " + format(pool.averageScore), 140, 60);
}

function format(value) {
    return Math.ceil(value * 100) / 100;
}
