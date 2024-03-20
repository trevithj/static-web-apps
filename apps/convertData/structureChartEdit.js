import {structureParser as parser, stringify} from "./chartEdit.js";
import {digraph2Dot, digraph2DotBipartite} from "./formatters.js";
import Layout, {Helpers} from "./layouter.js";

const { link2VerbDiv, node2NounDiv, setNodeSizes } = Helpers;

// Initial view.
const SAMPLE_INPUT = `Grandmother\n  Mother\n    Daughter1\n    Daughter2\n      GrandDaughter`;
const input = document.querySelector(".the-input > textarea");
const display = document.querySelector(".the-display > textarea");
const theChart = document.querySelector(".the-chart");
input.value = window.localStorage.getItem("INPUT_STRUCTURE") || SAMPLE_INPUT;

let parsed = {};

function svgFormat() {
    const output = ['<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">',
        '<style>',
        '.text-container { position: relative; }',
        '.text-container > div { position: absolute; text-align: center; max-width: 10rem; }',
        'foreignObject { overflow: scroll }',
        '</style>',
        '<g class="links"/>',
        '<foreignObject x="0" y="0" width="100%" height="100%">',
        '<div xmlns="http://www.w3.org/1999/xhtml" class="text-container">',
        '</div>',
        '</foreignObject>',
        "</svg>"
    ];
    return output.join("\n");
}

theChart.innerHTML = svgFormat(parsed);

function calcNodeSizes(nodes) {
    const {a: dw, d: dh} = theChart.querySelector("svg").getScreenCTM().inverse();
    return setNodeSizes(nodes, dw, dh);
}

function drawChart(parsed) {
    const container = theChart.querySelector(".text-container");
    container.innerHTML = "";

    const {nodes, links} = parsed;
    if (!nodes) return;
    const nounNodes = nodes.map(node2NounDiv);
    const nodeMap = new Map(nounNodes.map(n => [n.node.id, n]));
    const verbNodes = links.map(link2VerbDiv(nodeMap));
    const nounElements = nounNodes.map(n => n.div);
    const verbElements = verbNodes.map(n => n.div);
    // const verbElements = links.map(link2VerbDiv(nodeMap));
    container.append(...nounElements);
    container.append(...verbElements);

    const dataNodes = calcNodeSizes([...nounNodes, ...verbNodes]);
    const layout = Layout(dataNodes, nodeMap);
    // console.log(dataNodes);
    layout.updateNodeLayout();
    layout.updateNodePositions();
    const interval = setInterval(() => {
        layout.updateNodeLayout();
        layout.updateNodePositions();
        layout.updateDivPositions();
    }, 0);
    setTimeout(() => {
        clearInterval(interval);
        layout.updateDivPositions();
        layout.drawLinks(theChart.querySelector("g.links"));
        // redraw the nodes, so lines aren't on top
        // container.innerHTML = "";
        // dataNodes.forEach(n => container.append(n.div));
        // console.log(dataNodes[5]);
    }, 500)

    // console.log(dataNodes[24].dx);
    // layout.updateNodeLayout();
    // // console.log(dataNodes[24].dx);
    // layout.updateNodePositions();
    // layout.updateDivPositions();
    // layout.drawLinks(theChart.querySelector("g.links"));
}

input.addEventListener("blur", evt => {
    parsed = parser(evt.target.value);
    window.localStorage.setItem("INPUT_STRUCTURE", evt.target.value);
})

// Raw format
document.querySelector("button#b0").addEventListener("click", evt => {
    display.value = stringify(parsed);
    // theLog.textContent = JSON.stringify(parsed, null, 3);
})

// DOT format
document.querySelector("button#b1").addEventListener("click", evt => {
    display.value = digraph2Dot(parsed);
})
// DOT format, bipartite graph
document.querySelector("button#b2").addEventListener("click", evt => {
    display.value = digraph2DotBipartite(parsed);
})

// SVG format
document.querySelector("button#b3").addEventListener("click", evt => {
    // display.value = svgFormat(parsed);
    drawChart(parsed); //, theLog.querySelector(".text-container"));
})

input.focus();

