import {structureParser as parser, stringify} from "./chartEdit.js";
import {digraph2Dot, digraph2DotBipartite} from "./formatters.js";
import { DrawChart } from "./structureChartDraw.js";
// import Layout, {Helpers} from "./layouter.js";

// const { link2VerbDiv, node2NounDiv, setNodeSizes } = Helpers;

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

// SVG format
document.querySelector("button#b3").addEventListener("click", evt => {
    // display.value = svgFormat(parsed);
    const { drawChart } = DrawChart(
        parsed,
        theChart.querySelector(".text-container"),
        theChart.querySelector("svg")
    );
    drawChart();
})

input.focus();
