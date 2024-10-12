const store = {
    cols: 10,
    rows: []
};
// TEMP
store.rows.push([1,2,3,4,5]);
store.rows.push([2,3,4,3,2]);
store.rows.push([3,3,3,3,3]);

function log(msg) {
    document.querySelector("#logs").innerHTML = msg;
}

const rows = document.querySelector("#rows");

const range =  document.querySelector("input[name=cols]");
store.cols = Number.parseInt(range.value);

range.addEventListener("change", e => {
    store.cols = eval(e.target.value);
    render(store);
});

const controlsData = ["delete|&#9249;","move|&#x2191;","scale|&#x2217;","add|&#xff0b;"];
function makeCtrls(rowIndex) {
    return controlsData.map(data => {
        const [type, label] = data.split("|");
        const invalid = type==="move" && rowIndex === 0 ? "disabled" : "";
        return `<button class="ctrl" data-type="${type}" data-row="${rowIndex}" ${invalid}>${label}</button>`;
    })
}

function getRowStyle(cols) {
    const common = "display:grid; gap:3px; grid-template-columns";
    return `${common}: repeat(5, 2em) repeat(${cols}, 5em);`;
}

function renderRow(data) {
    const { index, values, cols } = data;
    const rowDiv = `<div class="row" data-index="${index}" style="${getRowStyle(cols)}">`;
    const indexCell = `<div class="cell index">${index}</div>`;
    const valCells = values.map(n => {
        return `<div class="cell value">${n}</div>`;
    });
    return [rowDiv, ...makeCtrls(index), indexCell, ...valCells, "</div>"].join("");
}

// ---------------
function getNumbers(label, defaultValue) {
    const values = prompt(label, defaultValue);
    if (!values) return { status: "cancelled "};
    const numbers = values.split(",").map(v => eval(v)); // allow entering expressions
    if(numbers.some(n => isNaN(n))) return {
        numbers, status: "invalid"
    };
    return { numbers, status: "ok" };
}

function btnListener(evt) {
    const { type, row } = evt.target.dataset;
    const rowIndex = Number.parseInt(row);
    if(type === "delete") {
        store.rows = store.rows.filter((r, i) => i !== rowIndex);
    } else if(type === "move") {
        if(rowIndex === 0) return; //not allowed
        const thisRow = store.rows[rowIndex];
        store.rows[rowIndex] = store.rows[rowIndex-1];
        store.rows[rowIndex-1] = thisRow;
    } else if(type === "scale") {
        const { numbers, status } = getNumbers("How much to multiply row by?", 1);
        if (status !== "ok") return; // TODO: log reason
        const [scale] = numbers;
        store.rows[rowIndex] = store.rows[rowIndex].map(n => n * scale);
    } else if(type === "add") {
        const { numbers, status } = getNumbers("Enter which row to add", 0);
        if (status !== "ok") return; // TODO: log reason
        const [refRowIndex] = numbers;
        const refRow = store.rows[refRowIndex];
        const tgtRow = store.rows[rowIndex].map((v, i) => v + refRow[i]);
        store.rows[rowIndex] = tgtRow;
    } else {
        console.log({type, rowIndex});
    }
    render();
}

// Top buttons
document.querySelector("#addRow").addEventListener("click", () => {
    const { cols } = store;
    const defaultValues = Array.from({ length: cols }, () => "0").join(",");
    const result = getNumbers(`Enter ${cols} comma-delimited values:`, defaultValues);
    if (result.status !== "ok") return log(result.status);
    if (result.numbers.length !== cols) return log("Wrong number of elements:" + result.numbers.length + " vs " + cols);
    store.rows.push(result.numbers);
    render();
});
document.querySelector("#dupRow").addEventListener("click", () => {
    const result = getNumbers("Enter the row number to duplicate", 0);
    if (result.status !== "ok") {
        // TODO: log status
        return; // cancelled or invalid
    }
    const [rowIndex] = result.numbers;
    const refRow = store.rows[rowIndex];
    store.rows.push([...refRow]);
    render();
});

function render() {
    // Remove any listeners
    document.querySelectorAll("button.ctrl").forEach(btn => btn.removeEventListener("click", btnListener));
    const { cols } = store;
    const html = store.rows.map((values, index) => {
        return renderRow({ index, values, cols });
    })
    rows.innerHTML = html.join("");
    // re-add listeners
    document.querySelectorAll("button.ctrl").forEach(btn => btn.addEventListener(
        "click", btnListener
    ));
}

render();
