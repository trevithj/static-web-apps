import {makeSVGElement} from "../../../common/modules/selectors.js";

function round(factor) {
    return n => Math.round(n * factor) / factor;
}

export function getCirclePoints(n) {
    const delta = Math.PI * 2 / n;
    const rnd = round(100000);
    const coords = [];
    while(n > 0) {
        const xy = {
            x: rnd(Math.sin(delta * n)),
            y: rnd(Math.cos(delta * n)),
            id: n
        };
        coords.push(xy);
        n -= 1;
    }
    console.log(coords);
    return coords;
}

export function makeCircles(coords) {
    return coords.map(xy => {
        const { x, y }= xy;
        const circle = makeSVGElement("circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 4);
        circle._data = xy;
        return circle;
    });
}

export function control(circles) {
    return {
        deselectAll: () => circles.forEach(circle => circle.classList.remove("active")),
        selectOnly: (ids) => circles.forEach(circle => {
            const { id } = circle._data;
            if (ids.includes(id)) {
                circle.classList.add("active");
            } else {
                circle.classList.remove("active");
            }
        })
    }
}
