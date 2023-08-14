export function strToArray(str) {
    //strip out any character that isn't a digit, period or minus, then split into numbers.
    return str.replace(/[^\d.-]/g, '|')
        .split('|')
        .flatMap(v => {
            const n = Number.parseFloat(v.trim());
            return isNaN(n) ? [] : [n];
        });
}

// Calculate the stats
export function quantile(sorted, q) {
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

export function getStats(vals, index) {
    if (!vals.length) return null;
    vals.sort((a,b) => a - b);
    const last = vals.length - 1;
    const max = vals[last];
    const min = vals[0];
    const med = quantile(vals, 0.5);
    const lq = quantile(vals, 0.25);
    const uq = quantile(vals, 0.75);
    const iqr = uq - lq;
    const ucl = uq + (1.5 * iqr);
    const lcl = lq - (1.5 * iqr);
    return {min, lq, med, uq, max, iqr, ucl, lcl, vals, index};
}

function getToPercent(statsList) {
    const pc = {max: 0, min: 9999999};
    statsList.forEach(stats => {
        if (!stats) return '';
        const {max, min} = stats;
        pc.max = Math.max(pc.max, max);
        pc.min = Math.min(pc.min, min);
    });
    pc.range = pc.max - pc.min;
    console.log(9999, pc);
    return v => (v - pc.min) / pc.range;
}

export function calcPercents(statsList) {
    const fields = "min lq med uq max lcl ucl".split(" ");
    const toPercent = getToPercent(statsList);
    return statsList.map(stats => {
        console.log(9999, stats);
        const vals = stats.vals.map(toPercent);

        return fields.reduce((map, field) => {
            const v = stats[field];
            map[field] = toPercent(v);
            return map;
        }, {vals});
    });
}

const INPUT_VALS = "InputValues";
const INPUT_TEXT = "InputLabels";

export function getInputValues() {
    const json = localStorage.getItem(INPUT_VALS);
    if (!json) return [
        [4,5,6,7,8],
        [5,6,7,8,9]
    ];
    return JSON.parse(json);
}

export function setInputValues(values, labels) {
    localStorage.setItem(INPUT_VALS, JSON.stringify(values));
    if (labels) localStorage.setItem(INPUT_TEXT, JSON.stringify(labels));
}

export function getInputLabels() {
    const json = localStorage.getItem(INPUT_TEXT);
    if (!json) return ["Set 1", "Set 2"];
    return JSON.parse(json);
}

export function clearInputs() {
    localStorage.removeItem(INPUT_VALS);
    localStorage.removeItem(INPUT_TEXT);
}
