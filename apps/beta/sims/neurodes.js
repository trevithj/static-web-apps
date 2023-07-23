const neuronFactory = bias => weights => inputs => {
    // Ensure the number of inputs matches the number of weights
    if (inputs.length !== weights.length) {
        throw new Error('Number of inputs must match number of weights');
    }

    // Multiply each input by its corresponding weight and sum the results
    const weightedSum = inputs.reduce((acc, val, i) => acc + (val * weights[i]), 0);

    // Add the bias to the weighted sum
    const activation = weightedSum + bias;

    // Apply the activation function (in this case, a simple step function)
    return activation >= 0 ? 1 : 0;
}

const neuron1 = neuronFactory(0); // default with zero bias

// const inputs = [0, 1, 1];
// const hiddenLayerWeights = [[1, 1, -1], [-1, -1, 1]];
// const outputWeights = [1, -1];

// const hiddenLayerOutput = hiddenLayerWeights.map(weights => neuron(weights)(inputs));
// const output = neuron(outputWeights)(hiddenLayerOutput);

// console.log(output); // Output: 1


// Here's an example of how you can use the curried version of the neuron function to calculate the outputs of an array of 10 input arrays, using a set of random weights:

const randomWeights = [-0.2, 0.3, 0.5];

const calculateOutput = neuron1(randomWeights);

const inputs = [
    [0.5, -0.7, 0.3],
    [0.1, 0.8, -0.5],
    [-0.2, -0.4, 0.6],
    [0.9, -0.2, 0.1],
    [-0.6, -0.1, -0.8],
    [0.7, -0.9, 0.4],
    [0.2, 0.3, -0.1],
    [0.4, 0.1, 0.5],
    [-0.3, 0.6, -0.4],
    [0.8, -0.4, 0.2]
];

const outputs = inputs.map(calculateOutput);

console.log(outputs);

///////////////////////// My attempt ///////////////////////////

const perceptronCalc = neurode => inputs => {
    const {weights, bias = 0} = neurode;
    // Ensure the number of inputs matches the number of weights
    if (inputs.length !== weights.length) {
        throw new Error('Number of inputs must match number of weights');
    }

    // Multiply each input by its corresponding weight and sum the results
    const weightedSum = inputs.reduce((acc, val, i) => acc + (val * weights[i]), 0);

    // Add the bias to the weighted sum
    const activation = weightedSum + bias;

    // Apply the activation function (in this case, a simple step function)
    return activation >= 0 ? 1 : 0;
}


function linearRegression(data) {
    const n = data.length;
    let xSum = 0, ySum = 0, xySum = 0, xxSum = 0;

    data.forEach((datum, i) => {
        xSum += i;
        ySum += datum;
        xySum += i * datum;
        xxSum += i * i;
    })

    const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    return {slope, intercept};
}

const data = [1, 2, 3, 4, 5];
const { slope, intercept } = linearRegression(data);
console.log(`slope: ${slope}, intercept: ${intercept}`);
