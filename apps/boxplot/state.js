import {calcPercents, clearInputs, getInputLabels, getInputValues, getStats, setInputValues} from "./calcs.js";

function calcStats(values, labels) {
    setInputValues(values, labels);
    const stats = values.map(getStats);
    return stats.map(stat => {
        const label = labels[stat.index];
        return {...stat, label}
    });
}

function getInitState(actionType) {
    const values = getInputValues();
    const labels = getInputLabels();
    const stats = calcStats(values, labels);
    const percents = calcPercents(stats);
    const width = 800;
    return {stats, percents, values, labels, width, actionType}
}


export function reducer(state, action) {
    state = state || getInitState("INIT");
    const { type:actionType, payload} = action;
    switch (actionType) {
        case "INPUTS_CHANGED": {
            const {values, labels} = payload;
            const stats = calcStats(values, labels);
            const percents = calcPercents(stats);
            console.log(9999, percents);
            return {...state, stats, percents, values, labels, actionType};
        }
        case "ROW_ADDED": {
            const {values: oldVals, labels: oldText} = state;
            const values = [...oldVals, payload.value];
            const labels = [...oldText, payload.label];
            const stats = calcStats(values, labels);
            const percents = calcPercents(stats);
            return {...state, stats, percents, values, labels, actionType};
        }
        case "ROW_REMOVED": {
            const {index} = payload;
            const {values: oldVals, labels: oldText} = state;
            const values = oldVals.filter((v, i) => i !== index);
            const labels = oldText.filter((v, i) => i !== index);
            const stats = calcStats(values, labels);
            const percents = calcPercents(stats);
            return {...state, stats, percents, values, labels, actionType};
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
