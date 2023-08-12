import {calcPercents, getInputLabels, getInputValues, getStats} from "./calcs.js";

function calcStats(values, labels) {
    const stats = values.map(getStats);
    return stats.map(stat => {
        const label = labels[stat.index];
        return {...stat, label}
    });
}

function getInitState() {
    const values = getInputValues();
    const labels = getInputLabels();
    const stats = calcStats(values, labels);
    const percents = calcPercents(stats);
    const width = 800;
    const actionType = '';
    return {stats, percents, values, labels, width, actionType}
}

const InitState = getInitState();

export function reducer(state = InitState, action) {
    const { type:actionType, payload} = action;
    switch (actionType) {
        case "INPUTS_CHANGED": {
            const {values, labels} = payload;
            const stats = calcStats(values, labels);
            const percents = calcPercents(stats);
            return {...state, stats, percents, values, actionType};
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
            return InitState;
        }
        default: return state;
    }
}
