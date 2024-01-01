// galtonBox(10, 60);

// Maybe it is just simpler to animate the object using old-fashioned JS intervals.
// fn bounce(el, dx, dy, duration)
function bounce(toX, yArray) {
    const xDelta = toX / yArray.length;
    return yArray.map((y, i) => {
        const x = (i+1) * xDelta;
        return { x, y };
    });
}

function velocity(acceleration, ticks, initV = 0) {
    const a = new Array(ticks).fill(0);
    return a.map((y,i) => {
        const t = i + 1;
        return initV + acceleration * t;
    });
}

function displacement(acceleration, ticks, initV = 0) {
    const a = new Array(ticks).fill(0);
    return a.map((y,i) => {
        const t = i + 1;
        const tsq = t ** 2;
        return initV * t + (acceleration * tsq)/2;
    })
}

// Version that uses a custom iterator to drive each tick of the sim
function* bouncer(options) {
    const { balls = 1, levels = 3 } = options;
    let b = balls;
    while(b > 0) {
        let count = levels;
        while(count > 0 ) {
            const dx = Math.random() > 0.5 ? 1 : -1;
            yield {dy: levels - count, index: balls - b, dx };
            count -= 1;
        }
        b -= 1;
    }
    return;
}

module.exports = {
    bounce, bouncer, velocity, displacement
}