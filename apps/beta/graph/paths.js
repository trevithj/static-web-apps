import {makeSVGElement} from "../../../common/modules/selectors.js";

export function makeLinkPath(strokeColor) {
    const path = makeSVGElement("path");
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", "0.3");
    return path;
}

export function drawLinks(path, linksArray) {
    const d = linksArray.map(edge => edge[2]).join(" ");
    path.setAttribute("d", d);
}
