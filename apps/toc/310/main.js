import BASE from "../../../common/modules/base.js";
import * as DATA from "../../../data/sims/310.module.js";
import { initInfo } from "./info.js";
import { initNetwork } from "./network.js";
import { initResources } from "./resources.js";
import { initOrders} from "./orders.js";

const Default = {
    data: {},
    macColors: {},
    info: {cash: 0, time: 0, speed: 0}
};
function nextStep(info) {
    return {...info, time: info.time + 1};
}

BASE.initState((state = Default, {type, payload}) => {
    switch (type) {
        case 'DATA_SET': {
            return {...state, ...payload}
        }
        case 'NEXT_STEP': {
            return { ...state, info: nextStep(state.info, payload) };
        }
        case 'RM_PURCHASED': {
            //TODO
            return state;
        }
        default: return state;
    }
});

BASE.dispatch('DATA_SET', DATA);
console.log(BASE.getState());
// Set up the info screen
initInfo(BASE);
// Set up the network
initNetwork(BASE);
// Set up the macs
initResources(BASE);
// Set up the sim requirements
initOrders(BASE);
