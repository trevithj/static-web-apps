function mapFeed(feed) {
    const { stockId, conversion } = feed;
    return { stockId, conversion, wip: 0 };
}

export function makeAlloc(mac, op, fedBy, fedTo) {
    const alloc = {
        id: `${mac.id}->${op.id}`, status: "idle", mac, op, wip: 0, stepsLeft: 0
    }
    alloc.fedBy = fedBy.map(mapFeed);
    alloc.fedTo = fedTo.map(mapFeed);
    return alloc;
};

export function allocsStep(allocs) {

}

function pushTo(fedTo, qty) {
    // add the qty to each fedTo instance
    return fedTo.map(feed => {
        const wip = qty + (feed.wip || 0);
        return {...feed, wip}
    });
}

function pullFrom(fedBy) {
    return 0;
}

function allocStep(alloc) {
    if (alloc.stepsLeft > 0) {
        return {...alloc, stepsLeft: alloc.stepsLeft - 1};
    }
    if (alloc.wip > 0) {
        //push to fedTo
        const fedTo = pushTo(alloc.fedTo, alloc.wip);
        return {...alloc, wip: 0, fedTo}
    };
    // else try to pull next wip
    const wip = pullFrom(alloc.fedBy);
    const stepsLeft = wip > 0 ? op.steps : 0;
    return {...alloc, wip, stepsLeft}
}
