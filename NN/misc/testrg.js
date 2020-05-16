

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

testcount = 100000;
vakjes = 100;
vakstep = 1.0 / vakjes;

gaussianrandom = [];

for (i = 0; i <= vakjes; i++)
{
	gaussianrandom[i] = 0;
}

for (i = 0; i <= testcount; i++)
{
	let r3 = randomGaussian(0, 0.1) + 0.5;

	let vak = 0;
	let 	lim = 0.0;
	while(true)
	{
		if (r3 > lim)
		{
			lim += vakstep;
			vak += 1;
		}
		else
		{
			gaussianrandom[vak - 1] += 1;
			break;
		}
	}
}


console.log("Gaussian Random JS")
for (i=0;i< gaussianrandom.length;i++)
{

	console.log(i + "\t" + gaussianrandom[i]);
}