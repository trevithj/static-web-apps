import BASE from "../../common/modules/base.js";
import {getInputLabels, getInputValues, strToArray} from "./calcs.js";
import {reducer} from "./state.js";
import {getPath2, makeDisplayRow, makeInputs} from "./views.js";

const {select, selectAll, listen, dispatch} = BASE;
BASE.initState(reducer);
BASE.logging = true;

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
    // add listeners
    Array.from(selectAll("button.remove", inputDiv)).forEach((btn, index) => {
        btn.addEventListener("click", () => {
            dispatch("ROW_REMOVED", { index });
        })
    });
}

updateInputs(inputValues, inputLabels);

// Locate the updatable elements
// views.svgs = Array.from(selectAll("svg", chartsDiv));
views.inputForm = select("#input-form");
views.reset = select("#reset");
views.addRow = select("#add");
views.statsDiv = select(".stats");

views.inputForm.addEventListener("change", () => {
    const fm = views.inputForm;
    const values = Array.from(selectAll("input.data", fm)).map(e => strToArray(e.value));
    const labels = Array.from(selectAll("input.label", fm)).map(e => e.value);
    dispatch("INPUTS_CHANGED", {values, labels});
})

views.addRow.addEventListener("click", () => {
    const value = [1, 2, 3, 4, 5];
    const label = "New row";
    dispatch("ROW_ADDED", {value, label});
    // const values = views.dataInputs.map(getValues);
    // const labels = views.dataLabels.map(el => el.value);
    // values.push([1,2,3,4,5]);
    // labels.push(`Set ${labels.length+1}`);
    // setInputValues(values, labels);

//    updateInputs(values, labels);

    // if (values.length >=8) views.addRow.setAttribute("disabled", true);
    // send("REFRESH");
});

// Update width if needed. TODO: replace with resizeObserver
select("#wid").addEventListener("change", evt => {
    const width = parseInt(evt.target.value);
    dispatch("WIDTH_CHANGED", {width});
});

function getValues(inputElement) {
    const {value = ""} = inputElement;
    const values = strToArray(value);
    values.sort((a, b) => a - b);
    return values;
}

views.reset.addEventListener("click", () => {
    dispatch("RESET");
})

// Update the display as required
listen("STATE_CHANGED", state => {
    const {stats, percents, actionType} = state;
    switch(actionType) {
        case "ROW_ADDED":
        case "ROW_REMOVED":
        case "RESET":
            updateInputs(state.values, state.labels);
        default: {
            const displayRows = percents.map((result, row) => {
                const d = getPath2(result, state.width);
                return makeDisplayRow(stats[row], d, row);
            });
            displayDiv.innerHTML = displayRows.join("\n");
            // const toPercent = state.width / overview.range;
        }
    }
})

// Initial plots
dispatch("START");
