
const frame = document.querySelector('.frame3');
const rm = frame.querySelector('.rm');
const op = frame.querySelector('.op');
const fg = frame.querySelector('.fg');
const ctrl = document.querySelector('div#control');
const data = {
    rm: 10, wip: 0, fg: 0, speed: 3000
}
const render = () => {7
    rm.textContent = data.rm;
    op.textContent = data.wip ? data.wip : '';
    fg.textContent = data.fg;
    ctrl.querySelector("span").textContent = `${data.speed}ms`;
};

op.addEventListener('transitionstart', () => {
    data.wip = 1;
    data.rm -= data.wip;
    render();
});

op.addEventListener('transitionend', () => {
    data.fg += data.wip;
    data.wip = 0;
    op.style.removeProperty("transition");
    op.style.setProperty("left", "0px");
    if(data.rm > 0) runMe.removeAttribute("disabled");
    render();
});

function run(op) {
    op.style.setProperty("transition", `left ${data.speed}ms linear 0s`);
    op.style.setProperty("left", "calc(100% - 100px)");
    render();
}

// function pause(op) {
//     const computedStyle = window.getComputedStyle(op);
//     const left = computedStyle.getPropertyValue('left');
//     op.style.left = left;
//     op.style.removeProperty("transition");
//     // op.classList.remove('horizTranslate');
// }
console.log(ctrl);
const speed = ctrl.querySelector('input#run-speed');
speed.addEventListener("change", () => {
    const percent = +speed.value;
    data.speed = Math.round(5000 - (4000 * percent/100));
    ctrl.querySelector("span").textContent = `${data.speed}ms`;
})
const runMe = ctrl.querySelector('button');
runMe.addEventListener("click", () => {
    runMe.setAttribute("disabled", true);
    run(op);
})

rm.addEventListener("click", () => {
    data.rm += 1;
    rm.textContent = data.rm;
    if(data.wip === 0) runMe.removeAttribute("disabled");
})

export default { run, render };