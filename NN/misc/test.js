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

let previous = false
let y2  = 0

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

for (let i = 1; i < 100; i++)
{
	console.log(randomGaussian(0, 0.1));
}
