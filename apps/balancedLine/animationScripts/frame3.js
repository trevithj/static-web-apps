
const frame = document.querySelector('.frame3');
const rm = frame.querySelector('.rm');
const op = frame.querySelector('.op');
const fg = frame.querySelector('.fg');
const data = {
    rm: 10, wip: 0, fg: 0
}
const render = () => {7
    rm.textContent = data.rm;
    op.textContent = data.wip ? data.wip : '';
    fg.textContent = data.fg;
};

op.addEventListener('transitionstart', () => {
    data.wip = 1;
    data.rm -= data.wip;
    render();
});

// op.addEventListener('transitionRun', () => {
//     data.rm -= data.wip;
//     data.fg += data.wip;
//     render();
// });

op.addEventListener('transitionend', () => {
    data.fg += data.wip;
    data.wip = 0;
    op.style.removeProperty("transition");
    op.style.setProperty("left", "0px");
    if(data.rm > 0) runMe.removeAttribute("disabled");
    render();
});

function run(op) {
    const speed = 1 + 3 * Math.random();
    op.style.setProperty("transition", `left ${speed}s ease`);
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

const runMe = document.querySelector('button#run');
runMe.addEventListener("click", () => {
    runMe.setAttribute("disabled", true);
    run(op);
})

export default { run };