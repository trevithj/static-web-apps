import Layout, {Helpers} from "./layouter.js";

const { link2VerbDiv, node2NounDiv, setNodeSizes } = Helpers;

const STORE = {
    theSvg: null,
    theContainer: null,
    theNetwork: {},
    selectedNode: null
}

function calcNodeSizes(nodes) {
    const {a: dw, d: dh} = STORE.theSvg.getScreenCTM().inverse();
    return setNodeSizes(nodes, dw, dh);
}

function createNodes(nodes, links, container) {
    const nounNodes = nodes.map(node2NounDiv);
    const nodeMap = new Map(nounNodes.map(n => [n.node.id, n]));
    const verbNodes = links.map(link2VerbDiv(nodeMap));
    const nounElements = nounNodes.map(n => n.div);
    const verbElements = verbNodes.map(n => n.div);
    // const verbElements = links.map(link2VerbDiv(nodeMap));
    container.append(...nounElements);
    container.append(...verbElements);

    const dataNodes = calcNodeSizes([...nounNodes, ...verbNodes]);
    return { dataNodes, nodeMap };
}

function layoutNodes() {
    // console.log(dataNodes);
    const { theLayout: layout, theLinksPath } = STORE;
    layout.updateNodeLayout();
    layout.updateNodePositions();
    const interval = setInterval(() => {
        layout.updateNodeLayout();
        layout.updateNodePositions();
        layout.updateDivPositions();
        layout.drawLinks(theLinksPath);
    }, 0);
    setTimeout(() => {
        clearInterval(interval);
        layout.updateDivPositions();
        layout.drawLinks(theLinksPath);
    }, 2000)
}

function drawChart(parsed, container) {
    container.innerHTML = "";
    const {nodes, links} = parsed;
    if (!nodes) return;
    
    const { dataNodes, nodeMap } = createNodes(nodes, links, container);
    // console.log(dataNodes);
    STORE.theLayout = Layout(dataNodes, nodeMap);
    STORE.nodeMap = nodeMap;
    window.DATA.dataNodes = dataNodes;
    window.DATA.nodeMap = nodeMap;
    layoutNodes();
}

export function DrawChart(parsed, container, svg) {
    STORE.theNetwork = parsed;
    STORE.theContainer = container;
    STORE.theSvg = svg;
    STORE.theLinksPath = svg.querySelector("g.links > path");
    return {
        drawChart: () => drawChart(parsed, container),
        drawLinks: () => STORE.theLayout.drawLinks(STORE.theLinksPath),
        redraw: () => {
            const { theLayout, theLinksPath } = STORE;
            theLayout.centerVerbNodes();
            theLayout.updateVerbNodePositions();
            theLayout.updateDivPositions();
            theLayout.drawLinks(theLinksPath);
        },
        getNodeById: id => STORE.nodeMap.get(id)
    }
}