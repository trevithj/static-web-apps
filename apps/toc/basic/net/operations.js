export function makeOp(id, steps, srcId, tgtId) {
    const fedBy = [{ matId: srcId, qty: 1}];
    const fedTo = [{ matId: tgtId, qty: 1}];
    const wip = []; // matId, qty, stepsLeft
    return { id, steps, fedBy, fedTo, wip };
}

const Default = {
    A: makeOp("A", 5, "RMA", "FGA"),
    B: makeOp("B", 8, "RMB", "FGB")
};

function handleTake(materials, op) {
    const { matId, qty } = op.fedBy[0];
    const src = materials[matId];
    const soh = src.soh - qty;
    return {...materials, [mid]: {...src, soh }};
}

function calcOperations(state, type, payload) {
    const { operations = Default } = state;
    switch(type) {
        case "TAKE": {
            const op = operations[payload.opId];
            return handleTake(op);
        }
        default: return operations;
    }
}

export default calcOperations;
