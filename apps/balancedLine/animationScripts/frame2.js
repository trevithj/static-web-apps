const frame = document.querySelector('.frame2');
const rm = frame.querySelector('.rm');
const op = frame.querySelector('.op2');
const fg = frame.querySelector('.fg');
const btn = document.querySelector('#tick');
const data = {
    rm: 10, wip: 0, fg: 0
}
const render = () => {
    rm.innerHTML = data.rm;
    op.innerHTML = data.wip ? data.wip : '_';
    fg.innerHTML = data.fg;
};

const doStart = () => {
    data.wip = 1;
    data.rm -= data.wip;
    btn.setAttribute("disabled", true);
    render();
};
const doFinish = () => {
    data.fg += data.wip;
    data.wip = 0;
    if (data.rm > 0) btn.removeAttribute("disabled");
    render();
};

const playAnimation = (duration) => {
    // Stop all current animations
    if (op.getAnimations) {
        op.getAnimations().map((anim) => anim.finish());
    }
    doStart();
    // Play the animation with the newly specified duration
    const animator = op.animate([
        {left: '50px'},
        {left: 'calc(100% - 150px)'}
    ], duration);
    animator.onfinish = doFinish;
};

// playAnimation(1000);
btn.addEventListener('click', () => {
    const duratn = Math.ceil(Math.random() * 2000) + 200;
    playAnimation(duratn);
    if (data.rm === 0) btn.disabled = true;
});

export default playAnimation;

/*
    // Configure duration slider
    var durationSlider = controls.querySelector('.duration-slider'),
    durationText = controls.querySelector('.duration-text');
    durationSlider.dispatchEvent(new Event('change'));
 
    durationSlider.addEventListener('change', () => {
        duration = durationSlider.value * 1000;
        durationText.textContent = 'Duration: ' + durationSlider.value + 's';
        playAnimation();
    });
*/

