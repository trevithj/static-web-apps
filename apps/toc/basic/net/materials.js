export function makeMaterial(matId, soh) {
    return { matId, soh }
}

const Default = {
    RMA: makeMaterial("RMA", 100),
    RMB: makeMaterial("RMB",  20),
    FGA: makeMaterial("FGA",  0),
    FGB: makeMaterial("FGB",  0)
};

function handleTake(materials, op) {
    const { mid: matId, qty } = op.fedBy[0];
    const src = materials[matId];
    const soh = src.soh - qty;
    return {...materials, [matId]: {...src, soh }};
}

function calcMaterials(state, type, payload) {
    const { materials = Default, operations } = state;
    switch(type) {
        case "MOVE": {
            const { src, tgt, wip } = payload;
            return handleTake(materials, op);
        }
        default: return materials;
    }
}

export default calcMaterials;
