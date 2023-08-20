export function renderMacs(state) {
    return state.net.macs.map(m => JSON.stringify(m, null, 3));
}

export function renderStock(state) {
    const mats = state.net.stock.map(op => JSON.stringify(op));
    return mats.join("\n");
}
export function renderOps(state) {
    const ops = state.net.ops.map(op => JSON.stringify(op));
    return ops.join("\n");
}

export function renderFeed(isFedBy) {
    return feed => {
        const { stockId, opId, conversion } = feed;
        const src = isFedBy ? stockId : opId;
        const tgt = isFedBy ? opId : stockId;
        return `${src} -(${conversion})-> ${tgt}`;
    }
}

export function renderFedBys(state) {
    return state.net.fedBys.map(renderFeed(true)).join("\n");
}
export function renderFedTos(state) {
    return state.net.fedBys.map(renderFeed(false)).join("\n");
}

const renderFeedShort = f => ` ${f.conversion} x ${f.stockId}`;
export function renderAllocs(state) {
    const alloc = state.net.allocs.map(a => {
        const { fedBy, fedTo, ...other } = a;
        console.log({fedBy, fedTo, other});
        const pairs = Object.entries(other).map(pair => {
            const [key, value] = pair;
            return `${key} = ${value}`;
        });
        pairs.push(`fedBy:\n ${fedBy.map(renderFeedShort).join("\n")}`);
        pairs.push(`fedTo:\n ${fedTo.map(renderFeedShort).join("\n")}`);
        // pairs.push(`fedTo: ${renderFedTos(fedTo)}`);
        return pairs.join("\n");
    });
    return alloc.join("-----\n");
}
/*
    const ops = state.net.ops.map(op => JSON.stringify(op));
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

*/