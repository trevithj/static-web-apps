import BASE from "../../../common/modules/base.js";
import calcMachine from "./machine.js";
import calcNet from "./net/net.js";
import * as NET from "./net/netRender.js";

function calcStats(stats = { time: 0, cashOnHand: 10000 }, type, payload) {
    switch(type) {
        case "STEP": {
            //payload = state to allow full context for calc?
            const time = stats.time +1;
            return {...stats, time };
        }
        default: return stats;
    }
}

BASE.initState((state = {}, {type, payload}) => {
    console.log(type, payload);
    const machine = calcMachine(state.machine, type, payload);
    const net = calcNet(state.net, type, payload);
    const stats = calcStats(state.stats, type, payload);
    const actionType = type;
    // TODO: the overall step calcs here?
    // Or break them down... update setups first
    // then update ops
    // then handle stock movements
    // sort of like micro-steps within each clock tick
    return {machine, net, stats, actionType };
});

const plog = BASE.select("pre#log");
const pnet = BASE.select("pre#net");
const pops = BASE.select("pre#ops");
BASE.listen("STATE_CHANGED", (state) => {
    console.dir(state.net);

    // TODO: divide screen up into areas for independent rendering
    // TODO: render conditionally on state.actionType

    const stats = JSON.stringify(state.stats, null, 3);
    plog.innerText = `Machine: ${NET.renderMacs(state)}\nStats: ${stats}`;
    pops.innerText = `Allocated:\n${NET.renderAllocs(state)}`;
    pnet.innerText = `Net.materials:\n${NET.renderStock(state)
    }\n\nNet.operations:\n${NET.renderOps(state)
    }\n\nNet.FedBys:\n${NET.renderFedBys(state)
    }\n\nNet.FedTos:\n${NET.renderFedTos(state)
    }`;
    // // TODO: check for when machine is in "taking" status, and dispatch a TAKE action.
});

function getPayload(state, opId) {
    const mac = state.net.macs[0];
    const op = state.net.opMap[opId];
    return { mac, op, net: state.net, opId };
}
const btns = BASE.selectAll(".controls button");
btns[0].addEventListener("click", () => {
    const state = BASE.getState();
    BASE.dispatch("STEP", state); // pass the whole state tree in
});
btns[1].addEventListener("click", () => {
    const state = BASE.getState();
    BASE.dispatch("ALLOCATE", getPayload(state, "Op-A"));
});
btns[2].addEventListener("click", () => {
    const state = BASE.getState();
    BASE.dispatch("ALLOCATE", getPayload(state, "Op-B"));
});
btns[3].addEventListener("click", () => {
    const state = BASE.getState();
    BASE.dispatch("TAKE", getPayload(state, "Op-A"));
});
btns[4].addEventListener("click", () => {
    const state = BASE.getState();
    BASE.dispatch("TAKE", getPayload(state, "Op-B"));
});


BASE.dispatch("INIT");
