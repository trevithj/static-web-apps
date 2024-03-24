// [Mat1] -> (Op-A) -> [Mat2]
import makeNet from "./network.js";

const theNet = makeNet();

function takeNextWork(mac, op) {
    if (op.fedBy.mat.soh === 0) {
        return "IDLE: no work to do.";
    } else {
        op.fedBy.mat.soh -= 1;
        mac.wip = 1;
        mac.steps = op.steps;
        return "Next work taken.";
    }
}

function pushAndDoNext(mac, op) {
    op.fedTo.mat.soh += 1;
    mac.wip = 0;
    const nextWorkStatus = takeNextWork(mac, op);
    return `Finished work pushed. ${nextWorkStatus}`;
}

// TODO: make a Process object with mac and op already set?
// since the processing doesn't really sit with either mac or op.
function process(mac) {
    const {opId, steps: inProgress, wip} = mac;
    if (!opId) {
        return "Machine is idle.";
    }
    const op = theNet.getOpData(opId);
    if (inProgress > 0 && wip > 0) {
        const stepStatus = mac.processStep();
        if (mac.steps === 0) {
            return `${stepStatus} ${pushAndDoNext(mac, op)}`;
        } else {
            return stepStatus;
        }
    }
    if (inProgress === 0 && wip === 0) {
        return takeNextWork(mac, op)
    }
    if (inProgress < 0 || wip < 0) {
        return "Error: illegal values!";
    }
    return pushAndDoNext(mac, op);
}

// ------------------------------------------------ //
const showStock = () => theNet.stock.map(s => s.soh);
console.log(showStock(), theNet.macs[0].toString());

console.log(showStock(), process(theNet.macs[0]));
theNet.macs[0].opId = "Op-A";
let n = 14;
while (n > 0) {
    n -= 1;
    const result = process(theNet.macs[0]);
    console.log(showStock(), result);
}

console.log(showStock(), theNet.macs[0].toString());
