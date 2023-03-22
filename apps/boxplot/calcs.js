/* global BASE */
(function() {
    const { select, listen, send } = BASE;
    const values = {};
    const stats = {};
    const svg = select("svg");
    const state = { values, stats, svg, width: 800 };
    // Capture the data
    function strToArray(str) {
        //strip out any character that isn't a digit, period or minus, then split into numbers.
        return str.replace(/[^\d.-]/g, '|')
        .split('|')
        .flatMap(v => {
            const n = Number.parseFloat(v.trim());
            return isNaN(n) ? [] : [n];
        });
    }
    const ins = ["#in1","#in2","#in3","#in4"].map(select);
    // Update width if needed
    select("#wid").addEventListener("change", evt => {
        state.width = parseInt(evt.target.value);
        svg.style.width = `${state.width}px`;
        render();
    });

    
    // Calculate the stats
    function quantile(sorted, q) {
        const pos = (sorted.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        if (sorted[base + 1] !== undefined) {
            return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
        } else {
            return sorted[base];
        }
    };
    function getStats(vals) {
        if (!vals.length) return null;
        const last = vals.length -1;
        const max = vals[last];
        const min = vals[0];
        const med = quantile(vals, 0.5);
        const lq = quantile(vals, 0.25);
        const uq = quantile(vals, 0.75);
        const iqr = uq - lq;
        const ucl = uq + (1.5 * iqr);
        const lcl = lq - (1.5 * iqr);
        return { min, lq, med, uq, max, iqr, ucl, lcl, vals };
    }

    function updateValues(inputElement) {
        const { id, value = ""} = inputElement;
        values[id] = strToArray(value);
        values[id].sort((a,b) => a - b);
    }

    const recalc = select("#recalc");
    recalc.addEventListener("click", () => {
        ins.forEach(updateValues);
        Object.keys(values).forEach(key => {
            const vals = values[key] || [];
            stats[key] = getStats(vals);
        })
        render();
    })

    function getToPercent({min, max}) {
        return v => (v - min) / (max - min);
    }
    
    function render() {
        const pathClasses = ["a", "b", "c", "d"];
        const statsList = ["in1","in2","in3","in4"].map((id, i) => {
            const path = BASE.select(`path.${pathClasses[i]}`);
            const stats = state.stats[id];
            return {...stats, id, path, valid: !!stats };
        });
        const statsDiv = select(".stats");
        const overview = { max: 0, min: 9999999, valid: false };

        const html = statsList.map(stats => {
            if (!stats.valid) return '';
            overview.max = Math.max(overview.max, stats.max);
            overview.min = Math.min(overview.min, stats.min);
            // overview.valid = true;
            return `<pre>${ JSON.stringify(stats)}</pre>`;
        });
        // overview.max - overview.min;
        html.push(`<pre>${ JSON.stringify(overview)}</pre>`)
        statsDiv.innerHTML = html.join("");

        const toPercent = getToPercent(overview);
        statsList.forEach(stats => {
            if (!stats.valid) return;
            const { min, lq, med, uq, max, path, lcl, ucl, vals } = stats;
            const newVals = vals.map(toPercent);
            const result = [
                toPercent(min), toPercent(lq), toPercent(med), toPercent(uq), toPercent(max),
                toPercent(lcl), toPercent(ucl), ...newVals
            ];
            console.log(result, stats);
            renderPath(path, result);
        });
        // const toPercent = state.width / overview.range;

        // TODO
        console.log(state);
    }

    function renderPath(path, results) {
        const { width } = state;
        const ys = results.map(r => r * width);
        console.log(ys);
        const [ min, lq, med, uq, max, lcl, ucl, ...vals ] = ys;
        const lmin = Math.max(min, lcl);
        const lmax = Math.min(max, ucl);
        const d = [`M${lmin},40 V60 M${lmax},40 V60`];
        d.push(`M${lmin},50 H${lq} M${lmax},50 H${uq}`);
        d.push(`M${lq},20 H${med} V80 H${lq}Z`);
        d.push(`M${uq},20 H${med} V80 H${uq}Z`);
        console.log(vals);
        vals.forEach(v => {
            if(v<lmin || v>lmax) {
                d.push(`M${v},45 V55`)
            }
        })
        path.setAttribute("d", d.join(" "))
    }

    render()
}())
