import * as SEL from "../../../common/modules/selectors.js";
import {Edges} from "./edges.js";

function round(factor) {
    return n => Math.round(n * factor) / factor;
}

function getCirclePoints(n) {
    const delta = Math.PI * 2 / n;
    const rnd = round(100000);
    const coords = [];
    while(n > 0) {
        const xy = {
            x: rnd(Math.sin(delta * n)),
            y: rnd(Math.cos(delta * n)),
        };
        coords.push(xy);
        n -= 1;
    }
    return coords;
}

function drawLinks(path, edges) {
    const d = edges.getAll().map(edge => edge[2]).join(" ");
    path.setAttribute("d", d);
}

const chart = SEL.select(".chart svg");

const theViz = SEL.makeSVGElement("g");
theViz.setAttribute("id","theViz");

const edges = Edges();
const path = SEL.makeSVGElement("path");
path.setAttribute("stroke", "#999");
path.setAttribute("stroke-width", "0.3");
theViz.appendChild(path);

const coords = getCirclePoints(16).map(xy => {
    const { x, y }= xy;
    return {x: Math.round(x*45+50), y: Math.round(y*45+50)};
});
coords.forEach(xy => {
    const { x, y }= xy;
    const circle = SEL.makeSVGElement("circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 4);
    theViz.appendChild(circle);
})

coords.forEach(src => {
    const { x, y }= src;
    coords.forEach(tgt => {
        if (src !== tgt) {
            const wgt = `M${src.x},${src.y} L${tgt.x},${tgt.y}`;
            edges.add(src, tgt, wgt);
        }
    })
})

drawLinks(path, edges);
chart.appendChild(theViz);

console.log(edges.getAll());