function sum(weights, inputs) {
    const sums = inputs.map((n, i) => {
        const w = weights[i] || 0;
        return n * w;
    });
    return sums.reduce((total, s) => s + total, 0);
}

function clamp(total, lower, upper) {
    if (total > upper) return upper;
    if (total < lower) return lower;
    return total;
}

export function Neurode(weights, thresholds) {
    const [lower, upper] = thresholds;
    const neurode = { lastOutput: 0 };
    const calc = inputs => {
        const total = sum(weights, inputs);
        neurode.lastOutput = clamp(total, lower, upper);
        return neurode.lastOutput;
    }
    neurode.calc = calc;
    return neurode;
}


export function Synapses() {
    const linkArray = [];
    const add = (src, tgt, wgt) => {
        const link = Object.freeze([src, tgt, wgt]);
        linkArray.push(link);
    };
    const getBySource = theSrc => linkArray.filter(link => link[0] === theSrc);
    const getByTarget = theTgt => linkArray.filter(link => link[1] === theTgt);

    return {
        add,
        clear: () => linkArray.length = 0,
        getAll: () => linkArray,
        getBySource,
        getByTarget
    };
}
