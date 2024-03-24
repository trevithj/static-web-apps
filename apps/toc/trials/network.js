import makeMac from "./machine.js";

const makeOp = (id, steps) => Object.freeze({id, steps});
const makeFeed = (stockId, opId, conversion = 1) => Object.freeze({stockId, opId, conversion});
const makeStock = (id, soh) => Object.freeze({
    id,
    get soh() {return soh;},
    set soh(arg) {soh = arg; if (soh < 0) throw new Error("Cannot have negative stock")},
});

// [Mat1] -> (Op-A) -> [Mat2]
function makeNet() {
    const ops = [
        makeOp("Op-A", 3)
    ];
    const stock = [
        makeStock("Mat1", 4),
        makeStock("Mat2", 0)
    ];
    const macs = [
        makeMac("Mac1", "U", 24)
    ];
    const fedBys = [
        makeFeed("Mat1", "Op-A")
    ];
    const fedTos = [
        makeFeed("Mat2", "Op-A")
    ];
    const allocs = [];

    function getStock(matId) { return stock.find(m => m.id === matId); }
    function getFeedData(opId) {
        const fb1 = fedBys.find(f => f.opId === opId);
        const ft1 = fedTos.find(f => f.opId === opId);
        const fedBy = {...fb1, mat: getStock(fb1.stockId)}
        const fedTo = {...ft1, mat: getStock(ft1.stockId)}
        return {fedBy, fedTo};
    }
    function getOpData(opId) {
        const op = ops.find(op => op.id === opId);
        const feeds = getFeedData(opId);
        return {...op, ...feeds};
    }
    
    return Object.freeze({
        ops, stock, macs, fedBys, fedTos, allocs, getFeedData, getOpData
    });
};

export default makeNet;
