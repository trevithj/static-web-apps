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