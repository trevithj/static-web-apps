export function strToNumberArray(str) {
    //strip out any character that isn't a digit, period or minus, then split into numbers.
    return str.replace(/[^\d.-]/g, '|')
        .split('|')
        .flatMap(v => {
            const n = Number.parseFloat(v.trim());
            return isNaN(n) ? [] : [n];
        });
}

export function strToArray(str) {
    // split by tab, comma, space or pipe
    return str.split(/\t|,|\||\s+/);
    // .map(cell => cell.trim());
};

export function generateNumericScale({min, max}, count = 5) {
    const range = max - min;
    console.log(98989, max, min, range)
    const step = Math.pow(10, Math.floor(Math.log10(range / (count - 1))));
    const start = Math.ceil(min / step) * step;
    const scale = [];

    for (let value = start; value <= max; value += step) {
        scale.push(value);
    }
    return scale;
}
