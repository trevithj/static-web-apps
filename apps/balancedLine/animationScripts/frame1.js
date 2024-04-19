
const frame = document.querySelector('.frame1');
const rm = frame.querySelector('.rm');
const op = frame.querySelector('.op');
const fg = frame.querySelector('.fg');
const data = {
    rm: 10, wip: 0, fg: 0
}
const render = () => {
    rm.textContent = data.rm;
    op.textContent = data.wip ? data.wip : '';
    fg.textContent = data.fg;
};
// op.addEventListener('transitionstart', () => {
// 	rm.textContent = '0';
// });
// op.addEventListener('transitionend', () => {
// 	fg.innerHTML = '1';
// });
op.addEventListener('animationstart', () => {
    data.wip = 1;
    data.rm -= data.wip;
    render();
});

op.addEventListener('animationiteration', () => {
    data.rm -= data.wip;
    data.fg += data.wip;
    render();
});

op.addEventListener('animationend', () => {
    data.fg += data.wip;
    data.wip = 0;
    render();
});

function init() {
    op.style.setProperty("animation-name", "example");
    op.style.setProperty("animation-duration", "2s");
    op.style.setProperty("animation-iteration-count", "8");
    render();
}

export default init;
