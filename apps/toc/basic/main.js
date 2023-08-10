import BASE from "../../../common/modules/base.js";
import calcMachine from "./machine.js";
import calcNet from "./net/net.js";

function calcStats(state, type, payload) {
    const stats = state.stats || { time: 0 };
    switch(type) {
        case "STEP": {
            const time = stats.time +1;
            return {...stats, time }
        }
        default: return stats;
    }
}

const Default = {
    machine: calcMachine({}, "INIT"),
    net: calcNet({}, "INIT"),
    stats: calcStats({}, "INIT"),
    actionType:''
};


BASE.initState((state = Default, {type, payload}) => {
    console.log(type, payload);
    const machine = calcMachine(state, type, payload);
    const net = calcNet(state, type, payload);
    const stats = calcStats(state, type, payload);
    const actionType = type;
    return {machine, net, stats, actionType };
});

const plog = BASE.select("pre#log");
const pnet = BASE.select("pre#net");
const pops = BASE.select("pre#ops");
BASE.listen("STATE_CHANGED", (state) => {
    console.dir(state.net);
    const ops = state.net.ops.map(op => JSON.stringify(op));
    const mats = state.net.stock.map(op => JSON.stringify(op));
    pnet.innerText = JSON.stringify(state.net, null, 3);

    // TODO: divide screen up into areas for independent rendering
    // TODO: render conditionally on state.actionType

    const stats = JSON.stringify(state.stats, null, 3);
    const macs = state.net.macs.map(m => JSON.stringify(m, null, 3));
    const alloc = state.net.allocs.map(a => JSON.stringify(a, null, 2));

    // const { materials, operations } = state.net;
    // const mats = Object.values(materials).map(m => JSON.stringify(m)).join("\n");
    // const ops = Object.values(operations).map(o => JSON.stringify(o, (key, value) => {
    //     if (key==="fedBy" || key==="fedTo") return JSON.stringify(Object.values(value[0]));
    //     if (key==="wip") return value[0];
    //     return value;
    // }, 3)).join("\n");
    plog.innerText = `Machine: ${macs.join("\n")}\nStats: ${stats}`;
    // \n=====\nNet.materials:\n${mats
    // }\nNet.operations:\n${ops}`;
    pops.innerText = `Allocated:\n${alloc.join("\n")}`;
    pnet.innerText = `Net.materials:\n${mats.join("\n")}\n\nNet.operations:\n${ops.join("\n")}`;
    // // TODO: check for when machine is in "taking" status, and dispatch a TAKE action.
});

function getPayload(state, opId) {
    const mac = state.net.macs[0];
    const op = state.net.opMap[opId];
    return { mac, op };
}
const btns = BASE.selectAll(".controls button");
btns[0].addEventListener("click", () => {
    BASE.dispatch("STEP");
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
