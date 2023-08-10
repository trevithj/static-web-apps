import BASE from "../../common/modules/base.js";
import {calcStatsOverview, getStats, strToArray} from "./calcs.js";
import {StatsHeader, getPath, makeInputs, makePlotChart, makeStatsRow} from "./views.js";

const {select, selectAll, listen, send} = BASE;
const state = {stats: [], width: 800};
const views = {};

// Initialize the display
const inputDiv = select("div.inputs");
const chartsDiv = select("div.charts");
chartsDiv.style.width = `${state.width}px`;
const inputValues = [
    "4 5 6 7 8",
    "3 4 5 6 7",
    "1 2 5 8 9",
    "1 2 3 4 9",
];
makeInputs(inputDiv, inputValues);
chartsDiv.innerHTML = inputValues.map((v, i) => {
    return makePlotChart("M0,0 H800 V100 H-800 Z", i + 1);
}).join("\n");

// Locate the updatable elements
views.svgs = Array.from(selectAll("svg", chartsDiv));
views.recalc = select("#recalc");
views.addRow = select("#add");
views.dataInputs = Array.from(selectAll("input.data", inputDiv));
views.statsDiv = select(".stats");

// Update width if needed
select("#wid").addEventListener("change", evt => {
    state.width = parseInt(evt.target.value);
    chartsDiv.style.width = `${state.width}px`;
    render();
});

function getValues(inputElement) {
    const { value = ""} = inputElement;
    const values = strToArray(value);
    values.sort((a, b) => a - b);
    return values;
}

function calcStats() {
    const values = views.dataInputs.map(getValues);
    state.stats = values.map(getStats);
}

recalc.addEventListener("click", () => {
    calcStats();
    render();
})

// Update the display as required
function render() {
    // const pathClasses = ["a", "b", "c", "d"];
    const statsList = state.stats;
    const overview = calcStatsOverview(statsList);

    const html = statsList.map(makeStatsRow);
    // overview.max - overview.min;
    html.push(`<pre>${JSON.stringify(overview)}</pre>`)
    html.unshift(StatsHeader);
    views.statsDiv.innerHTML = html.join("");

    const {toPercent} = overview;
    statsList.forEach((stats, row) => {
        if (!stats) return;
        const {min, lq, med, uq, max, lcl, ucl, vals} = stats;
        const newVals = vals.map(toPercent);
        const result = [
            toPercent(min),
            toPercent(lq),
            toPercent(med),
            toPercent(uq),
            toPercent(max),
            toPercent(lcl),
            toPercent(ucl),
            ...newVals
        ];
        const d = getPath(result, state.width);
        const path = views.svgs[row].querySelector("path");
        path.setAttribute("d", d);
        console.log({row, result, stats});
    });
    // const toPercent = state.width / overview.range;

    // TODO
    console.log(state);
}

// Initial plots
calcStats();
render()
