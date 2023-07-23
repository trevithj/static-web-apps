import calcMaterials from "./materials.js";
import calcOperations from "./operations.js";

export function makeOp(id, steps, srcId, tgtId) {
    const fedBy = [{matId: srcId, qty: 1}];
    const fedTo = [{matId: tgtId, qty: 1}];
    const wip = []; // matId, qty, stepsLeft
    return {id, steps, fedBy, fedTo, wip};
}

const Default = {
    materials: calcMaterials({}, "INIT"),
    operations: calcOperations({}, "INIT"),
};

function handleTake(state, payload) {
    const {opId} = payload;
    const materials = {...state.net.materials };
    const operations = {...state.net.operations };
    const op = operations[opId];
    const src = op.fedBy[0];
    const wip = op.wip;
    // const materials = calcMaterials(state, "MOVE", {src, tgt, wip});
    if (wip.length > 0) {
        const tgt = op.fedTo[0];
        const qtyToPush = wip[0] * tgt.qty;
        const mat = materials[tgt.matId];
        materials[tgt.matId] = {...mat, soh: mat.soh + qtyToPush };
    }
    const mat = materials[src.matId];
    const qtyRemaining = mat.soh - src.qty;
    if (qtyRemaining >= 0) {
        materials[src.matId] = {...mat, soh: qtyRemaining };
        operations[opId] = {...op, wip: [src.qty]};
    } else {
        operations[opId] = {...op, wip: []};
    }
    //const operations = calcOperations(state, "INIT"),
    return { ...state.net, materials, operations };
}

function calcNet(state, type, payload) {
    const {net = Default} = state;
    switch (type) {
        case "TAKE": return handleTake(state, payload);
        // case "STEP": {
        //     const newState = {...state};
        //     state.operations = calcOperations(operations, type, payload.opId);
        //     state.materials = calcMaterials(materials, type, payload.opId);
        // }
        default: return net;
    }
}

export default calcNet;
