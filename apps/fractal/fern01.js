(function () {
    const getEl = sel => document.querySelector(sel);
    const display = getEl("div.container");
    var ctx;

    function setupCanvas() {
        display.innerHTML = '<canvas class="view"></canvas>';
        const canvas = getEl('canvas.view');
        canvas.style.backgroundColor = 'black';
        canvas.style.opacity = 0.8;
        canvas.width = 750;
        canvas.height = 380;
        ctx = canvas.getContext('2d');
        ctx.translate(0, 200);
        ctx.rotate(Math.PI * 3 / 2);
        ctx.fillStyle = 'white';
    }

    function plot(x, y) {
        ctx.beginPath();
        ctx.fillRect(x * 74, y * 74, 1, 1);
        ctx.stroke();
    }

    const calcX = (x, y, a, b) => a * x + b * y;
    const calcY = (x, y, c, d, f) => c * x + d * y + f;

    function* paintFern() {
        //Barnsley

        var x = y = 0;
        let r;
        while (true) { //endless loop
            r = Math.random();
            let xs = x;

            if (r < 0.02) {
                x = calcX(x, y, 0, 0);
                y = calcY(xs, y, 0, 0.16, 0);
            } else if (r < 0.86) {
                x = calcX(x, y, 0.85, 0.04);
                y = calcY(xs, y, -0.04, 0.85, 1.6); //last d?
            } else if (r < 0.93) {
                x = calcX(x, y, 0.2, -0.26);
                y = calcY(xs, y, 0.23, 0.22, 1.6);
            } else {
                d = 0.24;
                x = calcX(x, y, -0.15, 0.28);
                y = calcY(xs, y, 0.26, 0.24, 0.44);
            }

            yield ({x, y});
        }
    };

    setupCanvas();
    const fern = paintFern();
    const tick = () => {
        const result = fern.next();
        if (!result.done) { // should never be done
            const {x, y} = result.value;
            plot(x, y);
            setTimeout(tick, 0);
        }
    }
    tick();
}());

/*
 *
   0      0      0    .16     0      0    .01
  .85   .04   -.04    .85     0    1.6    .85
  .2   -.26    .23    .22     0    1.6    .07
 -.15   .28    .26    .24     0     .44   .07

var r0 = [   0,    0,   0, .25, 0, -.14, .02];
var r1 = [ .85,  .02,-.02, .83, 0, 1.00, .84];
var r2 = [ .09, -.28, .30, .11, 0,  .60, .07];
var r3 = [-.09,  .28, .30, .09, 0,  .70, .07];

 *
 */