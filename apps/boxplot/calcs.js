(function() {
    const values = {};
    const stats = {};
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
    function handleChange(evt) {
        const { id, value = ""} = evt.target;
        values[id] = strToArray(value);
        values[id].sort((a,b) => a - b);
    }
    ["#in1","#in2","#in3","#in4"].forEach(sel => {
        document.querySelector(sel).addEventListener("change", handleChange);
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
        const last = vals.length -1;
        const max = vals[last];
        const min = vals[0];
        const med = quantile(vals, 0.5);
        const lq = quantile(vals, 0.25);
        const uq = quantile(vals, 0.75);
        const iqr = uq - lq;
        const ucl = uq + (1.5 * iqr);
        const lcl = lq - (1.5 * iqr);
        return { min, lq, med, uq, max, iqr, ucl, lcl };
    }

    const recalc = document.querySelector("#recalc");
    recalc.addEventListener("click", () => {
        Object.keys(values).forEach(key => {
            const vals = values[key] || [];
            stats[key] = getStats(vals);
        })
        console.log(values, stats);
    })
}())
