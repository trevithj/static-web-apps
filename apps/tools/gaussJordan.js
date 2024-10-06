const store = {
    cols: 10,
    rows: []
};

const rows = document.querySelector("#rows");

const range =  document.querySelector("input[name=cols]");
store.cols = Number.parseInt(range.value);
console.log(store);

range.addEventListener("change", e => {
    store.cols = e.target.value;
    render(store);
});

const controlsData = ["delete|&#9249;","move|&#x2195;","scale|&#x2217;","add|&#xff0b;"];
function makeCtrls(rowIndex) {
    return controlsData.map(data => {
        const [type, label] = data.split("|");
        return `<button class="ctrl" data-type="${type}" data-row="${rowIndex}">${label}</button>`;
    })
}

function getRowStyle(cols) {
    const common = "display:grid; gap:3px; grid-template-columns";
    return `${common}: repeat(5, 2em) repeat(${cols}, 3em);`;
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
    const numbers = values.split(",").map(v => Number.parseFloat(v));
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
    } else if(type === "scale") {
        const { numbers, status } = getNumbers("How much to multiply row by?", 1);
        if (status !== "ok") return; // TODO: log reason
        const [scale] = numbers;
        store.rows[rowIndex] = store.rows[rowIndex].map(n => n * scale);
    } else {
        console.log({type, rowIndex});
    }
    render();
}

document.querySelector("#addRow").addEventListener("click", () => {
    const { cols } = store;
    const defaultValues = Array.from({ length: cols }, () => "0").join(",");
    const result = getNumbers(`Enter ${cols} comma-delimited values:`, defaultValues);
    if (result.status !== "ok") {
        // TODO: log status
        return; // cancelled or invalid
    }
    if (result.numbers.length !== cols) {
        // todo log problem
        return;
    }
    store.rows.push(result.numbers);
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
