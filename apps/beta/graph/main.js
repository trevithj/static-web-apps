import * as SEL from "../../../common/modules/selectors.js";
import {control, getCirclePoints, makeCircles} from "./circles.js";
import {Edges} from "./edges.js";
import {drawLinks, makeLinkPath} from "./paths.js";

const chart = SEL.select(".chart svg");

const theViz = SEL.makeSVGElement("g");
theViz.setAttribute("id", "theViz");

const linkPath = makeLinkPath("#bbb");
const highlightedLinkPath = makeLinkPath("blue");
theViz.appendChild(linkPath);
theViz.appendChild(highlightedLinkPath);

const NODES = 24;
const range = SEL.select("input.the-range");
range.setAttribute("max", NODES);

const coords = getCirclePoints(NODES).map(xy => {
    const {x, y, id} = xy;
    return {x: Math.round(x * 45 + 50), y: Math.round(y * 45 + 50), id};
});

const circles = makeCircles(coords);
const circleControl = control(circles);

circles.forEach(circle => {
    theViz.appendChild(circle);
});

const edges = Edges();

function makeLinks(coords, edges) {
    return max => {
        edges.clear();
        coords.forEach(src => {
            const tgts = coords
                .toSorted(() => Math.random() - 0.5)
                .filter((tgt) => src !== tgt)
                .slice(0, max);
            tgts.forEach(tgt => {
                const wgt = `M${src.x},${src.y} L${tgt.x},${tgt.y}`;
                edges.add(src, tgt, wgt);
            })
        })
    }
}
const updateLinks = makeLinks(coords, edges);
updateLinks(NODES);

drawLinks(linkPath, edges.getAll());
chart.appendChild(theViz);

circles.forEach(circle => {
    circle.addEventListener("click", evt => {
        const { id } = circle._data;
        circleControl.selectOnly([id]);
        const src = evt.target._data;
        const links = edges.getBySource(src);
        drawLinks(highlightedLinkPath, links);
    })
});

function getLinkCount() {
    const v = range.value;
    return parseInt(v);
}

SEL.select("button.the-refresh").addEventListener("click", () => {
    const c = getLinkCount(); // read the slider
    updateLinks(c);
    drawLinks(linkPath, edges.getAll());
})

SEL.select("button.the-stepper").addEventListener("click", () => {
    drawLinks(highlightedLinkPath, []);
    // identify all circles with class=active
    const activeCircles = theViz.querySelectorAll("circle.active");
    //get all linked circles as a Set
    const linked = new Set();
    activeCircles.forEach(srcCircle => {
        const src = srcCircle._data;
        const links = edges.getBySource(src);
        links.forEach(link => {
            linked.add(link[1]); // tgt
        })
    })
    //get set ids
    const ids = [...linked].map(tgt => tgt.id);
    circleControl.selectOnly(ids);
})
