// @ts-check

let pool;

function preload() {
}

function setup() {
    var canvas = createCanvas(600, 300);
    canvas.parent("canvas-parent");

    colorMode(HSB);
    colorMode(RGB);
    textAlign(LEFT, TOP);

    pool = new Pool(width, height, progress);
    pool.init(true);
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
