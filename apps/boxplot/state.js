import {calcPercents, clearInputs, getInputLabels, getInputValues, getStats, setInputValues} from "./calcs.js";

function calcStats(values, labels) {
    setInputValues(values, labels);
    const stats = values.map(getStats)
    .map(stat => {
        const label = labels[stat.index];
        return {...stat, label}
    });
    const { percents, scale } = calcPercents(stats);
    return { stats, percents, scale };
}

function getInitState(actionType) {
    const values = getInputValues();
    const labels = getInputLabels();
    const { stats, percents, scale } = calcStats(values, labels);
    const width = 800;
    return {stats, percents, values, labels, width, scale, actionType}
}


export function reducer(state, action) {
    state = state || getInitState("INIT");
    const { type:actionType, payload} = action;
    switch (actionType) {
        case "INPUTS_CHANGED": {
            const {values, labels} = payload;
            const { stats, percents, scale } = calcStats(values, labels);
            return {...state, stats, percents, values, labels, scale, actionType};
        }
        case "ROW_ADDED": {
            const {values: oldVals, labels: oldText} = state;
            const values = [...oldVals, payload.value];
            const labels = [...oldText, payload.label];
            const { stats, percents, scale } = calcStats(values, labels);
            return {...state, stats, percents, values, labels, scale, actionType};
        }
        case "ROW_REMOVED": {
            const {index} = payload;
            const {values: oldVals, labels: oldText} = state;
            const values = oldVals.filter((v, i) => i !== index);
            const labels = oldText.filter((v, i) => i !== index);
            const { stats, percents, scale } = calcStats(values, labels);
            return {...state, stats, percents, values, labels, scale, actionType};
        }
        case "RESET": {
            clearInputs();
            return getInitState("RESET");
        }
        case "WIDTH_CHANGED": {
            return { ...state, width: payload.width };
        }
        default: return state;
    }
}
