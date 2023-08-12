export function makeInput(value, i, label) {
    // For now, return an html string. TODO: create elements directly
    const index = i+1;
    const className = `set${index}`;
    const defaultLabel = `Set ${index}`;
    return `<div class="${className
    }"><input type="text" class="label" name="text${i}" value="${label || defaultLabel
    }"></input><input type="text" class="data" name="data${i}" value="${value || "1 2 3 4 5"
    }"></input><button class="remove">&#x274C;</button></div>`;
    // return `<label>${defaultLabel
    // }</label>\n<input type="text" class="data ${className
    // }" value="${value}" id="${inputId}"></input>`;
}

export function makeInputs(values, labels) {
    const html = values.map((v, i) => {
        const label = labels[i];
        return makeInput(v, i, label);
    });
    return html.join("\n");
}
// export function makeInputs(inputEl, values) {
//     inputEl.innerHTML = values.map((v, i) => {
//         return makeInput(i+1, v);
//     }).join("\n");
// }

export function getPath(results, width) {
    const ys = results.map(r => r * (width - 4) + 2);
    const [min, lq, med, uq, max, lcl, ucl, ...vals] = ys;
    const lmin = Math.max(min, lcl);
    const lmax = Math.min(max, ucl);
    const d = [`M${lmin},40 V60 M${lmax},40 V60`];
    d.push(`M${lmin},50 H${lq} M${lmax},50 H${uq}`);
    d.push(`M${lq},20 H${med} V80 H${lq}Z`);
    d.push(`M${uq},20 H${med} V80 H${uq}Z`);
    // draw any outliers
    vals.forEach(v => {
        if (v < lmin || v > lmax) {
            d.push(`M${v - 2},50 l2,5 l2,-5 l-2,-5 Z`)
        }
    })
    return d.join(" ");
}

export function getPath2(percents, width) {
    const y = p => p * (width - 4) + 2;
    const {min, lq, med, uq, max, lcl, ucl, vals} = percents;
    const lmin = y(Math.max(min, lcl));
    const lmax = y(Math.min(max, ucl));
    const ylq = y(lq);
    const yuq = y(uq);
    const ymed= y(med);
    const d = [`M${lmin},40 V60 M${lmax},40 V60`];
    d.push(`M${lmin},50 H${ylq} M${lmax},50 H${yuq}`);
    d.push(`M${ylq},20 H${ymed} V80 H${ylq}Z`);
    d.push(`M${yuq},20 H${ymed} V80 H${yuq}Z`);
    // draw any outliers
    vals.forEach(v => {
        const yv = y(v);
        if (yv < lmin || yv > lmax) {
            d.push(`M${yv - 2},50 l2,5 l2,-5 l-2,-5 Z`)
        }
    })
    return d.join(" ");
}

const StatsHeader = `<div class="row head"><p>ID</p><p>LQ</p><p>MD</p><p>UQ</p></div>`;

function makeStatsRow(stats) {
    const { id, lq, med, uq } = stats;
    if (!med) return '';
    return `<div class="row"><p>${id}</p><p>${lq}</p><p>${med}</p><p>${uq}</p></div>`;
}

export function makeStatsTable(statsList) {
    const html = statsList.map(makeStatsRow);
    // overview.max - overview.min;
    // html.push(`<pre>${JSON.stringify(overview)}</pre>`)
    html.unshift(StatsHeader);
    return html.join("\n");
}

export function makePlotChart(d, i) {
    const plotClass = `plot row${i}`;
    return `<svg width="100%" height="100">
    <rect x="0" y="0" width="100%" height="100%" fill="#ddd" />
    <g id="plots">
        <path class="${plotClass}" d="${d}"></path>
    </g>
</svg>`
}

function makeStats(stats, id) {
    const { min, max, lq, med, uq, label } = stats;
    return `<div class="stats"><strong>${label}</strong><p>Median: ${med}</p><p>IQR: ${lq} - ${uq}</p><p>Range: ${min} - ${max}</p></div>`;
}

export function makeDisplayRow(stats, d, i) {
    const statsBlock = makeStats(stats, i);
    const plotBlock = makePlotChart(d, i+1);
    return ['<div class="display-row">', statsBlock, plotBlock, "</div>"].join("");
}
