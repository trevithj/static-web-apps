import BASE from "../../common/modules/base.js";
import { StatsHeader, getPath, makeChart, makeInputs, makeStatsRow } from "./views.js";

const {select, selectAll, listen, send} = BASE;
const values = {};
const stats = {};
const svg = select("svg");
const state = {values, stats, svg, width: 800};
// Capture the data
function strToArray(str) {
    //strip out any character that isn't a digit, period or minus, then split into numbers.
    return str.replace(/[^\d.-]/g, '|')
        .split('|')
        .flatMap(v => {
            const n = Number.parseFloat(v.trim());
            return isNaN(n) ? [] : [n];
        });
}

// Initialize
const inputDiv = select("div.inputs");
const inputValues = [
    "4 5 6 7 8",
    "3 4 5 6 7",
    "1 2 5 8 9",
    "1 2 3 4 9",
];
makeInputs(inputDiv, inputValues);
const chartDiv = select("div.chart");
chartDiv.innerHTML = makeChart();

const ins = Array.from(selectAll("input.data"));
// Update width if needed
select("#wid").addEventListener("change", evt => {
    state.width = parseInt(evt.target.value);
    svg.style.width = `${state.width}px`;
    render();
});


// Calculate the stats
function quantile(sorted, q) {
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};
function getStats(vals) {
    if (!vals.length) return null;
    const last = vals.length - 1;
    const max = vals[last];
    const min = vals[0];
    const med = quantile(vals, 0.5);
    const lq = quantile(vals, 0.25);
    const uq = quantile(vals, 0.75);
    const iqr = uq - lq;
    const ucl = uq + (1.5 * iqr);
    const lcl = lq - (1.5 * iqr);
    return {min, lq, med, uq, max, iqr, ucl, lcl, vals};
}

function updateValues(inputElement) {
    const {id, value = ""} = inputElement;
    values[id] = strToArray(value);
    values[id].sort((a, b) => a - b);
}

const recalc = select("#recalc");
recalc.addEventListener("click", () => {
    ins.forEach(updateValues);
    Object.keys(values).forEach(key => {
        const vals = values[key] || [];
        stats[key] = getStats(vals);
    })
    render();
})

function getToPercent({min, max}) {
    return v => (v - min) / (max - min);
}

function render() {
    const pathClasses = ["a", "b", "c", "d"];
    const statsList = ["in1", "in2", "in3", "in4"].map((id, i) => {
        const path = BASE.select(`path.${pathClasses[i]}`);
        const stats = state.stats[id];
        return {...stats, id, path, valid: !!stats};
    });
    const statsDiv = select(".stats");
    const overview = {max: 0, min: 9999999, valid: false};

    const html = statsList.map(stats => {
        if (!stats.valid) return '';
        const {max, min} = stats;
        overview.max = Math.max(overview.max, max);
        overview.min = Math.min(overview.min, min);
        // overview.valid = true;
        return makeStatsRow(stats);
        // return `<div class="row"><p>${ JSON.stringify(stats)}</div>`;
    });
    // overview.max - overview.min;
    html.push(`<pre>${JSON.stringify(overview)}</pre>`)
    html.unshift(StatsHeader);
    statsDiv.innerHTML = html.join("");

    const toPercent = getToPercent(overview);
    statsList.forEach(stats => {
        if (!stats.valid) return;
        const {min, lq, med, uq, max, path, lcl, ucl, vals} = stats;
        const newVals = vals.map(toPercent);
        const result = [
            toPercent(min), toPercent(lq), toPercent(med), toPercent(uq), toPercent(max),
            toPercent(lcl), toPercent(ucl), ...newVals
        ];
        console.log(result, stats);
        renderPath(path, result);
    });
    // const toPercent = state.width / overview.range;

    // TODO
    console.log(state);
}

function renderPath(path, results) {
    const {width} = state;
    const d = getPath(results, width);
    path.setAttribute("d", d);
}

render()
