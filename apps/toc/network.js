(function () {

    // The network
    const SIZE = 'width=10 height=10';
    const textPos = "dominant-baseline=middle text-anchor=middle";
    function create(node) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const x = node.col * 10 - 10;
        const y = 90 - node.row * 10;
        element.style = `transform: translate(${x}px, ${y}px)`;
        return {element, x, y};
    }
    const renderStore = (store) => {
        const html = [
            `<rect x=2 y=1 width=6 height=4 stroke-width=0.2 class=${store.type} />`,
            `<text ${textPos} y=3 x=5 class="store">${store.qty}</text>`
        ].join('');
        store.element.innerHTML = html;
    }
    const renderOp = (op) => {
        const html = [
            `<title>${op.id}</title>`,
            `<ellipse cy=7.5 cx=5 rx=4 ry=2.5 fill=${op.fill} stroke=black stroke-width=0.2 />`,
            `<text ${textPos} y=7.5 x=5 class="optxt">${op.runtime}</text>`
        ].join('');
        op.element.innerHTML = html;
    }

    const {data310} = STATIC;
    const nodesMap = {}; // Needed for line plotting
    function mapNode(node) {
        nodesMap[node.id] = node;
        return node;
    }

    // Initial create and render of nodes
    const stores = data310.stores.map(store => {
        const {element, x, y} = create(store);
        const node = mapNode({...store, x, y, element});
        // element.innerHTML = renderStore(store);
        renderStore(node);
        return node;
    });
    const ops = data310.ops.map(op => {
        const fill = data310.macColors[op.type] || 'white';
        const {element, x, y} = create(op);
        const node = mapNode({...op, x, y, fill, element});
        // element.innerHTML = renderOp(op, fill);
        // return mapNode({...op, x, y, fill, element });
        renderOp(node);
        return node;
    })

    // Create the SVG view and add node elements
    const svg = document.querySelector('svg');
    const html = [
        '<rect x=0 y=0 width=80 height=100 stroke=#eee fill=#fafafa />',
        '<path id="links" fill=none stroke=silver stroke-width=0.5px />',
        '<g id="grid" />',
        '<g id="nodes" />',
    ];
    svg.innerHTML = html.join("\n");
    const nodeView = BASE.select('g#nodes');
    // Adding the node elements
    ops.forEach(op => {
        nodeView.appendChild(op.element);
    })
    stores.forEach(store => {
        nodeView.appendChild(store.element);
    })

    // Draw the links
    const path = BASE.select("path#links");
    const d = [];
    Object.keys(nodesMap).forEach(id => {
        const src = nodesMap[id];
        src.fedto.forEach(tgtId => {
            const tgt = nodesMap[tgtId];
            d.push(`M ${src.x},${src.y}`);
            d.push(`L${src.x},${tgt.y + 5} L${tgt.x},${tgt.y + 5}`);
        });
    });
    path.setAttribute("d", d.join(' '));

    // Add listeners
    stores.forEach(store => {
        if (store.type === 'RM') {
            store.element.addEventListener('click', () => {
                BASE.send('RM_CLICKED', store);
            })
        }
        if (store.type === 'FG') {
            store.element.addEventListener('click', () => {
                BASE.send('FG_CLICKED', store);
            })
        }
    })
    //console.log(nodesMap);

    BASE.listen('RM_CLICKED', (rm) => {
        rm.qty += 1;
        renderStore(rm);
        BASE.send('RM_UPDATED', rm);
    })
    BASE.listen('FG_CLICKED', (fg) => {
        console.log(fg);
    })

    // draw the reference grid
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(row =>
        `<text class="row" x=-3 y=${96 - (10 * row)}>${row}</text>`
    );
    const cols = 'A B C D E F G H'.split(' ').map((col, i) =>
        `<text class="col" y=98 x=${10 * i + 4}>${col}</text>`
    );
    BASE.select("#grid").innerHTML = [...rows, ...cols].join("");
}());