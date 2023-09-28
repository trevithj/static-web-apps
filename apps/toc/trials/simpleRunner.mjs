// [Mat1] -> (Op-A) -> [Mat2]

const makeOp = (id, steps) => ({id, steps});
const makeStock = (id, soh) => ({id, soh});
const makeMac = (id, type) => ({id, type, steps: 0, opId: null, wip: 0});
const makeFeed = (stockId, opId, conversion = 1) => ({stockId, opId, conversion});

const theNet = {
    ops: [
        makeOp("Op-A", 3)
    ], stock: [
        makeStock("Mat1", 4),
        makeStock("Mat2", 0)
    ], macs: [
        makeMac("Mac1", "U", 24)
    ], fedBys: [
        makeFeed("Mat1", "Op-A")
    ], fedTos: [
        makeFeed("Mat2", "Op-A")
    ], allocs: []
}

function getStock(matId) {
    return theNet.stock.find(m => m.id === matId);
}

function getFeedData(opId) {
    const fb1 = theNet.fedBys.find(f => f.opId === opId);
    const ft1 = theNet.fedTos.find(f => f.opId === opId);
    const fedBy = {...fb1, mat: getStock(fb1.stockId)}
    const fedTo = {...ft1, mat: getStock(ft1.stockId)}
    return {fedBy, fedTo};
}

function getOpData(opId) {
    const op = theNet.ops.find(op => op.id === opId);
    const feeds = getFeedData(opId);
    return {...op, ...feeds};
}

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

function processStep(mac) {
    mac.steps -= 1;
    return "Step processed.";
}

function pushAndDoNext(mac, op) {
    op.fedTo.mat.soh += 1;
    mac.wip = 0;
    const nextWorkStatus = takeNextWork(mac, op);
    return `Finished work pushed. ${nextWorkStatus}`;
}

function process(mac) {
    const {opId, steps: inProgress, wip} = mac;
    if (!opId) {
        return "Machine is idle.";
    }
    const op = getOpData(opId);
    if (inProgress > 0 && wip > 0) {
        const stepStatus = processStep(mac);
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
console.log(showStock(), theNet.macs[0]);

console.log(showStock(), process(theNet.macs[0]));
theNet.macs[0].opId = "Op-A";
let n = 14;
while (n > 0) {
    n -= 1;
    const result = process(theNet.macs[0]);
    console.log(showStock(), result);
}

console.log(showStock(), theNet.macs[0]);
