import makeData from "./data.js";
const frame = document.querySelector('.frame4');
const rm = frame.querySelector('.rm');
const op = frame.querySelector('.op');
const ctrl = document.querySelector('div#control4');

const data = makeData({
    rm: 10, wip: 0, fg: 0, speed: 3000
}, frame, ctrl);


const render = () => {
};

op.addEventListener('transitionend', () => {
    data.complete();
    op.style.removeProperty("transition");
    op.style.setProperty("left", "0px");
    if (data.rm > 0) run();
});

function run() {
    if (data.wip !== 0) throw new Error("Already running");
    if (data.rm === 0) throw new Error("Cannot run");
    data.setWip(1);
    setTimeout(() => {
        op.style.setProperty("transition", `left ${data.speed}ms linear 0s`);
        op.style.setProperty("left", "calc(100% - 100px)");
    }, 0);
}

const speed = ctrl.querySelector('input');
speed.addEventListener("change", () => {
    data.speed = +speed.value;
})

rm.addEventListener("click", () => {
    data.setRM(+1);
    if (data.wip === 0) run();
})

export default {run, render};