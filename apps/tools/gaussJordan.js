const store = {
    cols: 10,
    rows: []
};
// Temp init

store.rows.push([1,2,3,4,5,5,4,3,2,1]);
store.rows.push([2,2,3,5,5,5,4,3,2,1]);
store.rows.push([3,2,3,4,5,5,4,3,2,1]);
const rows = document.querySelector("#rows");

const range =  document.querySelector("input[name=columns]");
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
    const rowDiv = `<div class="row row-${index}" style="${getRowStyle(cols)}">`;
    const indexCell = `<div class="cell">${index}</div>`;
    const valCells = values.map(n => {
        return `<div class="cell"><input type="text" value="${n}" /></div>`;
    });
    return [rowDiv, ...makeCtrls(index), indexCell, ...valCells, "</div>"].join("");
}

function btnListener(evt) {
    console.log(evt.target.dataset); // type, row
}

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
