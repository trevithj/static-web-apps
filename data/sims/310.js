(function () {
    const macColors = {
        A: '#00f',
        B: '#090',
        C: '#09c',
        D: '#c00',
        E: '#c0c',
        F: '#960',
    }

    function makeStore(col, row, qty = 0, type = 'ST') {
        const id = `ST:${col}-${row}`;
        return {id, type, row, col, qty, fedby:[], fedto:[]};
    }
    function makeOp(type, col, row, runtime) {
        const id = `OP:${col}-${row}`;
        return {id, type, row, col, runtime, fedby:[], fedto:[]};
    }
    function makeMac(type, setup, row, col) {
        const id = `MAC:${col}-${row}`;
        return {id, type, setup, row, col};
    }

    const nodes = {};
    function mapNode(node) {
        nodes[node.id] = node;
    }
    function linkNodes(srcId, tgtId) {
        const src = nodes[srcId];
        const tgt = nodes[tgtId];
        try {
            src.fedto.push(tgtId);
            tgt.fedby.push(srcId);
        } catch (err) {
            console.error(`Bad link: ${srcId}->${tgtId}`, err);
        }
    }

    const ops = [
        makeOp("C", 1, 9, 18),
        makeOp("E", 1, 7, 20),
        makeOp("C", 1, 6, 15),
        makeOp("B", 1, 5, 15),
        makeOp("B", 1, 1, 4),
        makeOp("F", 2, 3, 8),
        makeOp("B", 3, 1, 5),
        makeOp("A", 3, 5, 6),
        makeOp("C", 4, 9, 6),
        makeOp("F", 4, 7, 9),
        makeOp("A", 5, 5, 28),
        makeOp("E", 5, 2, 10),
        makeOp("C", 5, 1, 9),
        makeOp("C", 6, 9, 10),
        makeOp("E", 6, 7, 7),
        makeOp("A", 6, 5, 14),
        makeOp("E", 6, 3, 20),
        makeOp("C", 6, 2, 12),
        makeOp("B", 6, 1, 15),
    ];

    const stores = [
        makeStore(1,0,0, 'RM'),
        makeStore(3,0,0, 'RM'),
        makeStore(5,0,0, 'RM'),
        makeStore(6,0,0, 'RM'),
        makeStore(1,9,0, 'FG'),
        makeStore(1,7),
        makeStore(1,6),
        makeStore(1,5),
        makeStore(1,1),
        makeStore(2,3,25),
        makeStore(3,1),
        makeStore(3,5),
        makeStore(4,7),
        makeStore(4,9,0,'FG'),
        makeStore(5,1),
        makeStore(5,2,15),
        makeStore(5,5),
        makeStore(6,1),
        makeStore(6,2),
        makeStore(6,3,10),
        makeStore(6,5),
        makeStore(6,7),
        makeStore(6,9,0, 'FG'),
    ]

    const macs = [
        makeMac("A", 15, 1, 1),
        makeMac("B", 120, 2, 1),
        makeMac("B", 120, 2, 2),
        makeMac("C", 50, 3, 1),
        makeMac("C", 50, 3, 2),
        makeMac("E", 30, 5, 1),
        makeMac("E", 30, 5, 2),
        makeMac("F", 0, 6, 1),
    ];

    ops.forEach(mapNode);
    stores.forEach(mapNode);
    macs.forEach(mapNode);
    //Update RM nodes with unit cost
    nodes['ST:1-0'].unitCost = 30;
    nodes['ST:3-0'].unitCost = 35;
    nodes['ST:5-0'].unitCost = 30;
    nodes['ST:6-0'].unitCost = 65;
    //Update FG nodes with unit price
    nodes['ST:1-9'].unitPrice = 180;
    nodes['ST:4-9'].unitPrice = 240;
    nodes['ST:6-9'].unitPrice = 180;

    // Now create the network
    // First, link each op to its matching store
    ops.forEach(op => {
        const ida = op.id.split(":");
        linkNodes(op.id, `ST:${ida[1]}`);
    })
    // Now link stores to next ops
    linkNodes('ST:1-0', 'OP:1-1');
    linkNodes('ST:3-0', 'OP:3-1');
    linkNodes('ST:5-0', 'OP:5-1');
    linkNodes('ST:6-0', 'OP:6-1');
    linkNodes('ST:1-1', 'OP:2-3');
    linkNodes('ST:3-1', 'OP:2-3');
    linkNodes('ST:2-3', 'OP:1-5');
    linkNodes('ST:2-3', 'OP:3-5');
    linkNodes('ST:1-5', 'OP:1-6');
    linkNodes('ST:1-6', 'OP:1-7');
    linkNodes('ST:1-7', 'OP:1-9');
    linkNodes('ST:3-5', 'OP:4-7');
    linkNodes('ST:4-7', 'OP:4-9');
    linkNodes('ST:5-1', 'OP:5-2');
    linkNodes('ST:5-2', 'OP:5-5');
    linkNodes('ST:5-5', 'OP:4-7');
    linkNodes('ST:6-1', 'OP:6-2');
    linkNodes('ST:6-2', 'OP:6-3');
    linkNodes('ST:6-3', 'OP:6-5');
    linkNodes('ST:6-5', 'OP:6-7');
    linkNodes('ST:6-7', 'OP:6-9');

    const STATIC = window.STATIC || {};

    STATIC.data310 = {
        ops, macs, stores, nodes, macColors
    }
    window.STATIC = STATIC;
}());
