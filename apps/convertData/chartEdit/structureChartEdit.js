import {structureParser as parser, stringify} from "./chartEdit.js";
import {digraph2Dot, digraph2DotBipartite} from "./formatters.js";
import {DrawChart} from "./structureChartDraw.js";
// import Layout, {Helpers} from "./layouter.js";

// const { link2VerbDiv, node2NounDiv, setNodeSizes } = Helpers;

window.DATA = {};

// Initial view.
const SAMPLE_INPUT = `Grandmother\n  Mother\n    Daughter1\n    Daughter2\n      GrandDaughter`;
const input = document.querySelector(".the-input > textarea");
const display = document.querySelector(".the-display > textarea");
const theChart = document.querySelector(".the-chart");
input.value = window.localStorage.getItem("INPUT_STRUCTURE") || SAMPLE_INPUT;

let parsed = {};
const ArrowHead = `
<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
  <path d="M 0 0 L 10 5 L 0 10 z" />
</marker>`;
const Style = `
.text-container { position: relative; }
.text-container > div { position: absolute; background-color: white }
foreignObject { overflow: visible }`;

function svgFormat() {
    const output = ['<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">',
        '<style>', Style, '</style>',
        '<defs>', ArrowHead, '</defs>',
        '<g class="viz">',
        '<g class="links">',
        '<path d="" stroke="blue" marker-mid="url(#arrow)">',
        '</g>',
        '<foreignObject x="0" y="0" width="100%" height="100%">',
        '<div xmlns="http://www.w3.org/1999/xhtml" class="text-container"></div>',
        '</foreignObject>',
        '</g>',
        "</svg>"
    ];
    return output.join("\n");
}

theChart.innerHTML = svgFormat();

//setSVG(theChart.querySelector("svg"));

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
    const defaultVerb = document.querySelector("input[name='verb']").value;
    display.value = digraph2DotBipartite(parsed, defaultVerb);
})

function Pointer(getNode, redraw) {
    const ref = {node: null, x: 0, y: 0};
    function setRefXY(evt) {
        ref.x = evt.clientX;
        ref.y = evt.clientY;
    }
    return Object.freeze({
        down: evt => {
            ref.node = getNode(evt.target.dataset.id);
            setRefXY(evt);
        },
        move: evt => {
            if (evt.buttons === 0) return;
            if (!ref.node) return;
            // { movementX:dx, movementY:dy } = evt;
            const dx = evt.clientX - ref.x;
            const dy = evt.clientY - ref.y;
            // const dx = Math.round(evt.clientX - ref.x);
            // const dy = Math.round(evt.clientY - ref.y);
            setRefXY(evt);
            ref.node.x += dx;
            ref.node.y += dy;
            redraw();
        }
    });
}

// SVG format
document.querySelector("button#b3").addEventListener("click", evt => {
    // display.value = svgFormat(parsed);
    const container = theChart.querySelector(".text-container");
    const defaultVerb = document.querySelector("input[name='verb']").value;
    const {drawChart, redraw, getNodeById} = DrawChart(
        parsed,
        container,
        theChart.querySelector("svg"),
        defaultVerb
    );
    drawChart();
    const pointer = Pointer(getNodeById, redraw);
    // function pointerDown(evt) {
    //     const nodeId = evt.target.dataset.id;
    //     console.log(getNodeById(nodeId));
    // }
    container.addEventListener("pointerdown", pointer.down);
    container.addEventListener("pointermove", pointer.move);
    // container.addEventListener("pointerup", pointer.up);
})

input.focus();
