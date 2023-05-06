const SVG = {};
(function () {
    const svgNS = "http://www.w3.org/2000/svg";

    function createCircle(attribs) {
        const {cx, cy} = attribs;
        return createNodePathSegment(cx, cy, 8);
    }

    function createNetworkDiagram(svg, nodes) {
        const circles = nodes.map(createCircle);

        const lines = nodes.flatMap((n1, i) => {
            const {cx: x2, cy: y2} = n1;
            const resp = [];
            nodes.some((n2, j) => {
                if (j >= i) return true;
                const {cx: x1, cy: y1} = n2;
                resp.push(createLinePathSegment(x1, y1, x2, y2));
                return false; // more to do
            });
            return resp;
        });

        // create the network elements
        const linePath = document.createElementNS(svgNS, "path");
        linePath.setAttribute("stroke", "#000000");
        linePath.setAttribute("d", lines.join(" "));
        svg.appendChild(linePath);

        const nodePath = document.createElementNS(svgNS, "path");
        nodePath.setAttribute("stroke", "#000000");
        nodePath.setAttribute("fill", "#008000");
        nodePath.setAttribute("d", circles.join(" "));
        svg.append(nodePath);

        // return the SVG snippet as a string
        return svg.outerHTML;
    }

    function createLinePathSegment(x1, y1, x2, y2) {
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    function createNodePathSegment(x, y, r = 8) {
        return `M ${x - r}, ${y} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;
    }

    SVG.createNetworkDiagram = createNetworkDiagram;



    function generateCoordinates(radius, numPoints) {
        return new Array(numPoints).fill(0).map((angle, i) => {
            angle = (i / numPoints) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            return [x,y];
        });
    }
    SVG.generateCoordinates = generateCoordinates;
}());
