function calculateTwelfthRootSequence(initialValue) {
    const twelfthRootOf2 = Math.pow(2, 1 / 12);
    const sequence = [initialValue];

    for (let i = 1; i < 12; i++) {
        sequence.push(sequence[i - 1] * twelfthRootOf2);
    }

    return sequence;
}

function roundToDecimal(decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return num => Math.round(num * factor) / factor;
}


function* generateValues(n) {
    const twelfthRootOf2 = Math.pow(2, 1 / 12);
    // const round = roundToDecimal(1);
    let count = 12;
    yield n;
    while (count > 0) {
        n = n * twelfthRootOf2;
        count -= 1;
        // yield round(n);
        // yield Math.round(n);
        yield n;
    }
}

// const values = [...generateValues(220)];
// console.log(values);

function makeScale(a, b) {
    const step = (b - a) / 10;
    const result = [];

    for (let i = 0; i < 11; i++) {
        result.push(a + step * i);
    }

    return result;
}

// console.log(makeScale(-100, 100));

// function closestMultipleOf5(a, b, step) {
//     const range = Math.abs(b - a);
//     const stepSize = Math.ceil(range / step);
//     const closestMultiple = Math.round(a / 5) * 5;
//     const multipleSteps = Math.round(range / stepSize);
//     const roundedClosestMultiple = Math.round(closestMultiple / 5) * 5;

//     const lowerBound = roundedClosestMultiple - Math.floor(multipleSteps / 2) * stepSize;
//     const upperBound = roundedClosestMultiple + Math.ceil(multipleSteps / 2) * stepSize;

//     if (lowerBound < a && upperBound > b) {
//         return stepSize;
//     }

//     if (lowerBound >= a && upperBound <= b) {
//         return stepSize;
//     }

//     return closestMultipleOf5(a, b, step + 1);
// }
// console.log(closestMultipleOf5(10,55, 7));

function getScale([a, b], [c, d]) {
    return value => {
        const scaledValue = ((value - a) / (b - a)) * (d - c) + c;
        return scaledValue;
    }
}
const scale = getScale([0,100],[-500,500]);
console.log([10,20,50, 110].map(scale));
