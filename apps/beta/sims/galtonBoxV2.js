// from https://www.rosettacode.org/wiki/Galton_box_animation
// const readline = require('readline');

// /**
//  * Galton Box animation
//  * @param {number} layers The number of layers in the board
//  * @param {number} balls The number of balls to pass through
//  */
// const galtonBox = (layers, balls) => {
//     const speed = 250;
//     const ball = 'o';
//     const peg = '.';
//     const result = [];

//     /**
//      * The board is represented as a 2D array.
//      * @type {Array<Array<string>>}
//      */
//     const board = [...Array(layers)]
//         .map((e, i) => {
//             const sides = Array(layers - i).fill(' ');
//             const a = Array(i + 1).fill(peg).join(' ').split('');
//             return [...sides, ...a, ...sides];
//         });

//     /**
//      * @return {Array<string>}
//      */
//     const emptyRow = () => Array(board[0].length).fill(' ');

//     /**
//      * @param {number} i
//      * @returns {number}
//      */
//     const bounce = i => Math.round(Math.random()) ? i - 1 : i + 1;

//     /**
//      * Prints the current state of the board and the collector
//      */
//     const show = () => {
//         readline.cursorTo(process.stdout, 0, 0);
//         readline.clearScreenDown(process.stdout);
//         board.forEach(e => console.log(e.join('')));
//         result.reverse();
//         result.forEach(e => console.log(e.join('')));
//         result.reverse();
//     };


//     /**
//      * Collect the result.
//      * @param {number} idx
//      */
//     const appendToResult = idx => {
//         const row = result.find(e => e[idx] === ' ');
//         if (row) {
//             row[idx] = ball;
//         } else {
//             const newRow = emptyRow();
//             newRow[idx] = ball;
//             result.push(newRow);
//         }
//     };

//     /**
//      * Move the balls through the board
//      * @returns {boolean} True if the there are balls in the board.
//      */
//     const iter = () => {
//         let hasNext = false;
//         [...Array(bordSize)].forEach((e, i) => {
//             const rowIdx = (bordSize - 1) - i;
//             const idx = board[rowIdx].indexOf(ball);
//             if (idx > -1) {
//                 board[rowIdx][idx] = ' ';
//                 const nextRowIdx = rowIdx + 1;
//                 if (nextRowIdx < bordSize) {
//                     hasNext = true;
//                     const nextRow = board[nextRowIdx];
//                     nextRow[bounce(idx)] = ball;
//                 } else {
//                     appendToResult(idx);
//                 }
//             }
//         });
//         return hasNext;
//     };

//     /**
//      * Add a ball to the board.
//      * @returns {number} The number of balls left to add.
//      */
//     const addBall = () => {
//         board[0][apex] = ball;
//         balls = balls - 1;
//         return balls;
//     };

//     board.unshift(emptyRow());
//     result.unshift(emptyRow());

//     const bordSize = board.length;
//     const apex = board[1].indexOf(peg);

//     /**
//   // TODO: rewrite this to use custom iterator from a Generator fn.
//     * Run the animation
//      */
//     function* runner() {
//         while (addBall()) {
//             yield;
//             iter();
//         }
//         yield;
//         while (iter()) {
//             yield;
//         }
//         yield;
//     }

//     const running = runner();
//     const timer = setInterval(() => {
//         const { done } = running.next();
//         show();
//         if (done) clearInterval(timer);
//     }, speed);
// };

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
    // const a = [initV];
    // let v = initV;
    // while(a.length < ticks) {
    //     v += acceleration;
    //     a.push(v);
    // }
    // return a;
}

// distance travelled in a given time
function accelerate(delta, ticks, initV = 0) {
    const a = [0];
    let v = initV;
    let distance = 0;
    while(a.length < ticks) {
        v += delta;
        distance += v;
        a.push(distance);
    }
    return a;
}

function displacement(acceleration, ticks, initV = 0) {
    const a = new Array(ticks).fill(0);
    return a.map((y,i) => {
        const t = i + 1;
        const tsq = t ** 2;
        return initV * t + (acceleration * tsq)/2;
    })
}

module.exports = {
    bounce, accelerate, velocity, displacement
}