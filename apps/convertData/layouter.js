function getCenter(node) {
    if(isNaN(node.x)) throw new TypeError("??");
    return {cx: node.x + (node.width / 2), cy: node.y + (node.height / 2)};
};

// Helpers

function setNodeSizes(nodes, dw = 1, dh = 1) {
    nodes.forEach(n => {
        const {width: w, height: h } = n.div.getBoundingClientRect();
        n.width = w * dw;
        n.height = h * dh;
        n.dx = 0;
        n.dy = 0;
    })
    return nodes;
}

function node2NounDiv(node, i) {
    const x = 50 * i + 20;
    const y = 25 * i + 20;
    const div = document.createElement("div");
    div.className = "noun";
    div.style = `left:${x}px;top:${y}px;`;
    div.innerHTML = node.name.replace("\\n", "<br/>");
    return {
        x, y,
        get node() {return node},
        get div() {return div},
        get type() {return "noun"}
    }
}

function link2VerbDiv(nodeMap) {
    return link => {
        const {src, tgt, label = "feeds"} = link;
        const x = nodeMap.get(src).x;
        const y = nodeMap.get(tgt).y;
        const div = document.createElement("div");
        div.className = "verb";
        div.style = `left:${x}px;top:${y}px;`;
        div.innerHTML = label.replace("\\n", "<br/>");
        return {
            x, y,
            get node() {return link},
            get div() {return div},
            get type() {return "verb"}
        }
    }
}

export const Helpers = {
    link2VerbDiv, node2NounDiv, setNodeSizes, getCenter
}

function calcOffsets(refNode, otherNode) {
    const tgtC = getCenter(refNode);
    const nbrC = getCenter(otherNode);
    const offsetX = nbrC.cx - tgtC.cx;
    const offsetY = nbrC.cy - tgtC.cy;
    const dist = Math.sqrt(offsetX ** 2 + offsetY ** 2);
    return {offsetX, offsetY, dist};
}

const MARGIN = 100;
function calcNeigbourDistance(tgt, nbr) {
    if (nbr === tgt) return [];
    const {offsetX, offsetY, dist} = calcOffsets(tgt, nbr);
    // console.log(offsetX, offsetY,dist);
    if (dist > MARGIN) return [];
    const force = (MARGIN - dist) / MARGIN
    return {offsetX, offsetY, dist, force};
}

function updateDataNodeLayout(dataNodes) {
    const DELTA = 5;
    dataNodes.forEach(dNode => {
        const closeNeigbours = dataNodes.flatMap(dn => {
            return calcNeigbourDistance(dNode, dn);
        });
        dNode.dx = 0;
        dNode.dy = 0;
        closeNeigbours.forEach(nbr => {
            const {offsetX, offsetY, dist, force} = nbr;
            dNode.dx -= force * (DELTA * (offsetX / dist));
            dNode.dy -= force * (DELTA * (offsetY / dist));
        });
    })
};

function updateVerbNodeLayout(dataNodes, nodeMap) {
    dataNodes.forEach(dNode => {
        if (dNode.type !== "verb") return;
        const {src, tgt} = dNode.node;
        const srcNode = nodeMap.get(src);
        const tgtNode = nodeMap.get(tgt);
        const pos1 = calcOffsets(dNode, srcNode);
        dNode.dx += (pos1.offsetX / pos1.dist);
        dNode.dy += (pos1.offsetY / pos1.dist);

        const pos2 = calcOffsets(dNode, tgtNode);
        dNode.dx += (pos2.offsetX / pos2.dist);
        dNode.dy += (pos2.offsetY / pos2.dist);
    })
};

export function updateNodeLayout(dataNodes, nodeMap) {
    updateDataNodeLayout(dataNodes);
    updateVerbNodeLayout(dataNodes, nodeMap);
}

function mRound(n) {
    return Math.max(Math.round(n), 0);
}

export function updateNodePositions(dataNodes) {
    dataNodes.forEach(dn => {
        const {dx, dy} = dn;
        dn.x = mRound(dn.x + dx);
        dn.y = mRound(dn.y + dy);
    })
};

export function updateDivPositions(dataNodes) {
    dataNodes.forEach(dn => {
        const {x, y, div} = dn;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
    })
};

function getDrawLink(d) {
    const rnd = Math.round;
    return (srcPoint, tgtPoint) => {
        const {cx: x1, cy: y1} = srcPoint;
        const {cx: x2, cy: y2} = tgtPoint;
        const midX = rnd((x1 + x2) / 2);
        const midY = rnd((y1 + y2) / 2);
        d.push(`M${rnd(x1)} ${rnd(y1)} L${midX} ${midY} L${rnd(x2)} ${rnd(y2)}`);
    }
}

export function drawLinks(dataNodes, nodeMap, path) {
    const d = [];
    const drawLink = getDrawLink(d);
    const verbNodes = dataNodes.filter(n => n.type === "verb");
    // console.log(verbNodes, group);
    verbNodes.forEach(verb => {
        const refPoint = getCenter(verb);
        const {src, tgt} = verb.node;
        const srcNode = nodeMap.get(src);
        const tgtNode = nodeMap.get(tgt);
        drawLink(getCenter(srcNode), refPoint);
        drawLink(refPoint, getCenter(tgtNode));
    });
    path.setAttribute("d", d.join(" "));
    console.log(path);
}

export default function constructor(dataNodes, nodeMap) {
    return Object.freeze({
        updateNodeLayout: () => updateNodeLayout(dataNodes, nodeMap),
        updateNodePositions: () => updateNodePositions(dataNodes),
        updateDivPositions: () => updateDivPositions(dataNodes),
        drawLinks: group => drawLinks(dataNodes, nodeMap, group),
    });
}