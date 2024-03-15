import {structureParser as parser, stringify} from "./chartEdit.js";
import {digraph2Dot, digraph2DotBipartite} from "./formatters.js";
import {setNodeSizes, updateDivPositions, updateNodeLayout, updateNodePositions} from "./layouter.js";
// Initial view.
const SAMPLE_INPUT = `Grandmother\n  Mother\n    Daughter1\n    Daughter2\n      GrandDaughter`;
const input = document.querySelector(".the-input > textarea");
const display = document.querySelector(".the-display > textarea");
const theLog = document.querySelector(".the-log");
input.value = window.localStorage.getItem("INPUT_STRUCTURE") || SAMPLE_INPUT;

let parsed = {};

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

function svgFormat() {
    const output = ['<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">',
        '<style>',
        '.text-container { position: relative; }',
        '.text-container > div { position: absolute; text-align: center; max-width: 10rem; }',
        '</style>',
        '<foreignObject x="0" y="0" width="100%" height="100%">',
        '<div xmlns="http://www.w3.org/1999/xhtml" class="text-container">',
        '</div>',
        '</foreignObject>',
        "</svg>"
    ];
    return output.join("\n");
}

theLog.innerHTML = svgFormat(parsed);

function calcNodeSizes(nodes) {
    const {a: dw, d: dh} = theLog.querySelector("svg").getScreenCTM().inverse();
    return setNodeSizes(nodes, dw, dh);
}

function drawChart(parsed) {
    const container = theLog.querySelector(".text-container");
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
    updateNodeLayout(dataNodes, nodeMap);
    updateNodePositions(dataNodes);
    const interval = setInterval(() => {
        updateNodeLayout(dataNodes, nodeMap);
        updateNodePositions(dataNodes);
        updateDivPositions(dataNodes);
    }, 0);
    setTimeout(() => {
        clearInterval(interval);
        updateDivPositions(dataNodes);
        console.log(dataNodes[5]);
    }, 1000)
    // 
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

// Structure format
// document.querySelector("button#b3").addEventListener("click", evt => {
//     display.value = sketchFormat(parsed);
// })
// SVG format
document.querySelector("button#b3").addEventListener("click", evt => {
    // display.value = svgFormat(parsed);
    // theLog.innerHTML = display.value;
    drawChart(parsed); //, theLog.querySelector(".text-container"));
})

input.focus();

