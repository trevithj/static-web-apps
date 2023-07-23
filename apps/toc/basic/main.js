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

const log = BASE.select("pre#log");
BASE.listen("STATE_CHANGED", (state) => {
    console.log(state);
    const mac = JSON.stringify(state.machine, null, 3);
    const stats = JSON.stringify(state.stats, null, 3);

    const { materials, operations } = state.net;
    const mats = Object.values(materials).map(m => JSON.stringify(m)).join("\n");
    const ops = Object.values(operations).map(o => JSON.stringify(o)).join("\n");
    log.innerText = `Machine: ${mac
    }\nStats: ${stats
    }\n=====\nNet.materials:\n${mats
    }\nNet.operations:\n${ops}`;
});

const btns = BASE.selectAll(".controls button");
btns[0].addEventListener("click", () => {
    BASE.dispatch("STEP");
});
btns[1].addEventListener("click", () => {
    const state = BASE.getState();
    BASE.dispatch("ALLOCATE", {mac:state.machine, opId: "A"});
});
btns[2].addEventListener("click", () => {
    const state = BASE.getState();
    BASE.dispatch("ALLOCATE", {mac:state.machine, opId: "B"});
});
btns[3].addEventListener("click", () => {
    const state = BASE.getState();
    BASE.dispatch("TAKE", {mac:state.machine, opId: "A"});
});
btns[4].addEventListener("click", () => {
    const state = BASE.getState();
    BASE.dispatch("TAKE", {mac:state.machine, opId: "B"});
});


BASE.dispatch("INIT");
