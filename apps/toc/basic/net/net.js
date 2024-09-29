import { makeAlloc } from "./allocated.js";

const makeOp = (id, steps) => ({ id, steps });
const makeStock = (id, soh) => ({ id, soh });
const makeMac = (id, type, setup) => ({ id, type, setup, steps:0, status: "free" });
const makeIdMap = (arr) => arr.reduce((map, item) => {
    map[item.id] = item;
    return map;
}, {});
const makeCanDo = (macId, opId) => ({ macId, opId});
const makeFeed = (stockId, opId, conversion = 1) => ({ stockId, opId, conversion});

const theNet = {
    ops: [
        makeOp("Op-A", 5),
        makeOp("Op-B", 8)
    ], stock:[
        makeStock("RM-A", 100),
        makeStock("RM-B", 25),
        makeStock("FG-A", 0),
        makeStock("FG-B", 0)
    ], macs:[
        makeMac("mac1", "U", 24)
    ], canDos:[
        makeCanDo("mac1", "Op-A"),
        makeCanDo("mac1", "Op-B")
    ], fedBys:[
        makeFeed("RM-A", "Op-A"),
        makeFeed("RM-B", "Op-B")
    ], fedTos:[
        makeFeed("FG-A", "Op-A"),
        makeFeed("FG-B", "Op-B")
    ], allocs:[]
}
theNet.stockMap = makeIdMap(theNet.stock);
theNet.opMap = makeIdMap(theNet.ops);

function deAllocate(net, mac, op) {
    const alloc = net.allocs.find(a => a.macId === mac.id);
    if(!alloc) return net; // no change
    // const fedByStock = alloc.fedBy.map(feed => net.stock.find(s => s.id===feed.stockId));
    const stock = net.stock.map(s => {
        const feed = alloc.fedBy.find(fb => fb.stockId === s.id);
        if (!feed) return s;
        const wip = alloc.wip * feed.conversion;
        const soh = s.soh + wip;
        return {...s, soh };
    });
    const stockMap = makeIdMap(stock);
    const allocs = net.allocs.filter(a => a !== alloc);
    return {...net, allocs, stock, stockMap};
}

function allocate(net, {mac, op}) {
    const macId = mac.id;
    const opId = op.id;
    const canDo = net.canDos.find(c => c.macId===macId && c.opId===opId);
    if (!canDo) throw new Error(`Bad allocation: mac ${macId} cannot do op ${opId}`);
    net = deAllocate(net, mac, op);
    const fedBy = net.fedBys.filter(f => f.opId === opId);
    const fedTo = net.fedTos.filter(f => f.opId === opId);
    const allocs = [...net.allocs, makeAlloc(mac, op, fedBy, fedTo)];
    const macs = net.macs.map(m => {
        if (m.id !== macId) return m;
        return {...m, status: "setup", steps: m.setup };
    })
    return {...net, allocs, macs};
}

function finishOp(net, alloc) {
    if(alloc.wip===0) return net; //ignore
    // const fedToStocks = alloc.fedTo.map()

}

//

//

export default function calcNet(net = theNet, type, payload) {
    console.log(net, type, payload);
    if(type==="ALLOCATE") return allocate(net, payload);
    // if(type==="TICK") return doUpdate(net, payload);
    return net;
}

export { allocate, deAllocate, finishOp };
