export function setNodeSizes(nodes, dw, dh) {
    return nodes.map(n => {
        const {width: w, height: h} = n.div.getBoundingClientRect();
        n.width = w * dw;
        n.height = h * dh;
        n.getCenter = () => (
            {cx: n.x + (n.width / 2), cy: n.y + (n.height / 2)}
        );
        return n;
    })
}

function calcOffsets(refNode, otherNode) {
    const tgtC = refNode.getCenter();
    const nbrC = otherNode.getCenter();
    const offsetX = nbrC.cx - tgtC.cx;
    const offsetY = nbrC.cy - tgtC.cy;
    const dist = Math.sqrt(offsetX ** 2 + offsetY ** 2);
    return { offsetX, offsetY, dist };
}

const MARGIN = 100;
function calcNeigbourDistance(tgt, nbr) {
    if (nbr === tgt) return [];
    const { offsetX, offsetY, dist } = calcOffsets(tgt, nbr);
    // console.log(offsetX, offsetY,dist);
    if (dist > MARGIN) return [];
    const force = (MARGIN - dist) / MARGIN
    return {offsetX, offsetY, dist, force};
}

export function updateAllNodeLayout(dataNodes) {
    const DELTA = 10;
    dataNodes.forEach(dNode => {
        const closeNeigbours = dataNodes.flatMap(dn => {
            return calcNeigbourDistance(dNode, dn);
        });
        dNode.dx = 0;
        dNode.dy = 0;
        closeNeigbours.forEach(nbr => {
            const { offsetX, offsetY, dist, force } = nbr;
            dNode.dx -= force * (DELTA * (offsetX/dist));
            dNode.dy -= force * (DELTA * (offsetY/dist));
        });
    })
};

function updateLinkedNodeLayout(dataNodes, nodeMap) {
    dataNodes.forEach(dNode => {
        if(dNode.type!=="verb") return;
        const { src, tgt } = dNode.node;
        const srcNode = nodeMap.get(src);
        const tgtNode = nodeMap.get(tgt);
        // console.log(src, srcNode, nodeMap);
        const pos1 = calcOffsets(dNode, srcNode);
        dNode.dx += (pos1.offsetX/pos1.dist);
        dNode.dy += (pos1.offsetY/pos1.dist);
        
        const pos2 = calcOffsets(dNode, tgtNode);
        dNode.dx += (pos2.offsetX/pos2.dist);
        dNode.dy += (pos2.offsetY/pos2.dist);
    })
};

export function updateNodeLayout(dataNodes, nodeMap) {
    updateAllNodeLayout(dataNodes);
    updateLinkedNodeLayout(dataNodes, nodeMap);
}

export function updateNodePositions(dataNodes) {
    dataNodes.forEach(dn => {
        const {dx, dy, div} = dn;
        dn.x = Math.max(Math.round(dn.x + dx), 0);
        dn.y = Math.max(Math.round(dn.y + dy), 0);
        // div.style.left = `${dn.x}px`;
        // div.style.top = `${dn.y}px`;
    })
};

export function updateDivPositions(dataNodes) {
    dataNodes.forEach(dn => {
        const {x, y, div} = dn;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
    })
};