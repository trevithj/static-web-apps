import * as SEL from "../../../common/modules/selectors.js";
import {getCirclePoints, makeCircles} from "./circles.js";
import {Edges} from "./edges.js";
import {drawLinks, makeLinkPath} from "./paths.js";

const chart = SEL.select(".chart svg");

const theViz = SEL.makeSVGElement("g");
theViz.setAttribute("id","theViz");

const linkPath = makeLinkPath("#bbb");
const highlightedLinkPath = makeLinkPath("blue");
theViz.appendChild(linkPath);
theViz.appendChild(highlightedLinkPath);

const coords = getCirclePoints(16).map(xy => {
    const { x, y }= xy;
    return {x: Math.round(x*45+50), y: Math.round(y*45+50)};
});

const circles = makeCircles(coords);

circles.forEach(circle => {
    theViz.appendChild(circle);
});

// const MAX_LINKS = 5;
const edges = Edges();

coords.forEach(src => {
    coords.forEach(tgt => {
        if (src !== tgt) {
            const wgt = `M${src.x},${src.y} L${tgt.x},${tgt.y}`;
            edges.add(src, tgt, wgt);
        }
    })
})

drawLinks(linkPath, edges.getAll());
chart.appendChild(theViz);

console.log(edges.getAll());

circles.forEach(circle => {
    circle.addEventListener("click", evt => {
        const src = evt.target._data;
        const links = edges.getBySource(src);
        drawLinks(highlightedLinkPath, links);
    })
});
