export function makeInput(index, value) {
    // For now, return an html string. TODO: create elements directly
    const className = `data set${index}`;
    const inputId = `in${index}`;
    const defaultLabel = `Set ${index}`;
    return `<label>${defaultLabel
    }</label>\n<input type="text" class="${className
    }" value="${value}" id="${inputId}"></input>`;
}

export function makeInputs(inputEl, values) {
    inputEl.innerHTML = values.map((v, i) => {
        return makeInput(i+1, v);
    }).join("\n");
}

export function getPath(results, width) {
    const ys = results.map(r => r * (width - 4) + 2);
    console.log(ys);
    const [min, lq, med, uq, max, lcl, ucl, ...vals] = ys;
    const lmin = Math.max(min, lcl);
    const lmax = Math.min(max, ucl);
    const d = [`M${lmin},40 V60 M${lmax},40 V60`];
    d.push(`M${lmin},50 H${lq} M${lmax},50 H${uq}`);
    d.push(`M${lq},20 H${med} V80 H${lq}Z`);
    d.push(`M${uq},20 H${med} V80 H${uq}Z`);
    console.log(vals);
    // draw any outliers
    vals.forEach(v => {
        if (v < lmin || v > lmax) {
            d.push(`M${v - 2},50 l2,5 l2,-5 l-2,-5 Z`)
        }
    })
    return d.join(" ");
}

export const StatsHeader = `<div class="row head"><p>ID</p><p>LQ</p><p>MD</p><p>UQ</p></div>`;

export function makeStatsRow(stats) {
    const { id, lq, med, uq } = stats;
    return `<div class="row"><p>${id}</p><p>${lq}</p><p>${med}</p><p>${uq}</p></div>`;
}

export function makeChart() {
    return `<svg width="800" height="400">
    <rect x="0" y="0" width="100%" height="100%" fill="#ddd" />
    <g id="plots">
        <path class="a plot" d="M0,0 H800 V100 H-800 Z"></path>
        <path class="b plot" d="M0,0 H800 V100 H-800 Z"></path>
        <path class="c plot" d="M0,0 H800 V100 H-800 Z"></path>
        <path class="d plot" d="M0,0 H800 V100 H-800 Z"></path>
    </g>
</svg>`
}