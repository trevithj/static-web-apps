import BASE from "../../common/modules/base.js";
import {calcStatsOverview, clearInputs, getInputLabels, getInputValues, getStats, setInputValues, strToArray} from "./calcs.js";
import {getPath, makeDisplayRow, makeInputs} from "./views.js";

const {select, selectAll, listen, send} = BASE;
const state = {stats: [], width: 800};
const views = {};

// Initialize the display
const inputDiv = select("div.inputs");
// const chartsDiv = select("div.charts");
const displayDiv = select("div.display");

// chartsDiv.style.width = `${state.width}px`;
const inputValues = getInputValues();
const inputLabels = getInputLabels();

function updateInputs(values, labels) {
    inputDiv.innerHTML = makeInputs(values, labels);
    views.dataInputs = Array.from(selectAll("input.data", inputDiv));
    views.dataLabels = Array.from(selectAll("input.label", inputDiv));
}

updateInputs(inputValues, inputLabels);

// Locate the updatable elements
// views.svgs = Array.from(selectAll("svg", chartsDiv));
views.inputForm = select("#input-form");
views.reset = select("#reset");
views.addRow = select("#add");
views.statsDiv = select(".stats");

views.inputForm.addEventListener("change", () => {
    // const { name, value } = event.target;
    // const index = parseInt(name.substring(4));
    // console.log(name, value, index);
    calcStats();
    render();
})

views.addRow.addEventListener("click", () => {
    const values = views.dataInputs.map(getValues);
    const labels = views.dataLabels.map(el => el.value);
    values.push([1,2,3,4,5]);
    labels.push(`Set ${labels.length+1}`);
    setInputValues(values, labels);

    updateInputs(values, labels);

    if (values.length >=8) views.addRow.setAttribute("disabled", true);
    send("REFRESH");
});

// Update width if needed. TODO: replace with resizeObserver
select("#wid").addEventListener("change", evt => {
    state.width = parseInt(evt.target.value);
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
    const labels = views.dataLabels.map(el => el.value);
    setInputValues(values, labels);
    state.stats = values.map(getStats);
    state.stats.forEach((stat, i) => {
        stat.label = labels[i];
    });
}

views.reset.addEventListener("click", () => {
    clearInputs();
    const inputValues = getInputValues();
    const inputLabels = getInputLabels();
    updateInputs(inputValues, inputLabels);
    send("REFRESH");
})

listen("REFRESH", () => {
    setTimeout(() => {
        calcStats();
        render();
    }, 0);
})
// Update the display as required
function render() {
    // const pathClasses = ["a", "b", "c", "d"];
    const statsList = state.stats;
    const overview = calcStatsOverview(statsList);

    const {toPercent} = overview;
    const displayRows = statsList.map((stats, row) => {
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
        return makeDisplayRow(stats, d, row);
    });
    displayDiv.innerHTML = displayRows.join("\n");
    // const toPercent = state.width / overview.range;

    // TODO
    console.log(state);
}

// Initial plots
send("REFRESH");
