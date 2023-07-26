const makeOp = (id, steps) => ({ id, steps });
const makeStock = (id, soh) => ({ id, soh });
const makeIdMap = (arr) => arr.reduce((map, item) => {
    map[item.id] = item;
    return map;
}, {});
const makeMac = (id, type, setup) => ({ id, type, setup, steps:0, status: "free" });
const makeCanDo = (macId, opId) => ({ macId, opId});
const makeFeed = (stockId, opId, conversion = 1) => ({ stockId, opId, conversion});
const makeAlloc = (mac, op, fedBy, fedTo) => ({
    id: `${mac.id}->${op.id}`, mac, op, fedBy, fedTo, wip:0 , stepsLeft:0
});

const net = {
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
net.stockMap = makeIdMap(net.stock);

function deAllocate(net, mac, op) {
    const alloc = net.allocs.find(a => a.op.id === op.id && a.mac.id === mac.id);
    if(!alloc) return net; // no change
    // const fedByStock = alloc.fedBy.map(feed => net.stock.find(s => s.id===feed.stockId));
    const stock = net.stock.map(s => {
        const feed = alloc.fedBy.find(fb => fb.stockId === s.id);
        if (!feed) return s;
        const wip = alloc.wip * feed.conversion;
        const soh = s.soh + wip;
        return {...s, soh };
    });

    const allocs = net.allocs.filter(a => a !== alloc);
    return {...net, allocs, stock};
}

function allocate(net, macId, opId) {
    const canDo = net.canDos.find(c => c.macId===macId && c.opId===opId);
    if (!canDo) throw new Error(`Bad allocation: mac ${macId} cannot do op ${opId}`);
    const mac = net.macs.find(m => m.id===macId);
    if (!mac) throw new Error(`Unknown macId ${macId} `);
    const op = net.ops.find(o => o.id===opId);
    if (!op) throw new Error(`Unknown opId ${opId} `);
    net = deAllocate(net, mac, op);
    const fedBy = net.fedBys.filter(f => f.opId === opId);
    const fedTo = net.fedTos.filter(f => f.opId === opId);
    const allocs = [...net.allocs, makeAlloc(mac, op, fedBy, fedTo)];
    return {...net, allocs};
}
