export function initInfo(BASE) {
    const view = BASE.select(".info");
    view.innerHTML = `
    <div id="time"></div>
    <div id="cash"></div>
    <button id="tick">Next Step</button>
    <button id="auto">Run Sim</button>
    <button id="quit">Quit</button>
    <input id="speed" type="range" min="1" max="10" />
    `;
    const info = {
        cash: 11000,
        time: 0,
        speed: 0,
    }
    const els = {
        timeEl: BASE.select('#time'),
        cashEl: BASE.select('#cash'),
        nextBtn: BASE.select('#tick'),
        autoBtn: BASE.select('#auto'),
        quitBtn: BASE.select('#quit'),
        speedEl: BASE.select('#speed'),
    }
    function fmt(n) {
        const a = [n < 10 ? '0' : '', n];
        return a.join("");
    }
    function updateTime() {
        const {time} = info;
        // const week = Math.floor(time / 2400);
        const day = Math.floor(time / 480);
        const hour = fmt(Math.floor(time / 60));
        const min = fmt(time % 60);

        // <p>Week:<span>${week + 1}</span></p>
        els.timeEl.innerHTML = `
            <p>Day:<span>${day + 1}</span></p>
            <p>Time:<span>${hour}:${min}</span></p>
        `.trim();
    }
    function updateCash() {
        els.cashEl.innerHTML = `
        <p>Cash on hand:<span>$${info.cash}</span></p>
        `.trim();
    }
    function tick() {
        const { time, cash, speed } = info;
        info.time += 1;
        updateTime();
        BASE.pub('NEXT_STEP', { time, cash, speed });
        BASE.dispatch('NEXT_STEP', { time, cash, speed });
    }
    function autoTick() {
        tick();
        const {running, speed} = info;
        if (running) {
            const timeOut = (12 - speed) * 100;
            info.timeout = setTimeout(autoTick, timeOut);
        }
    }
    // Initialize view
    updateTime();
    updateCash();
    info.speed = +els.speedEl.value;

    BASE.logging = true;

    els.nextBtn.addEventListener("click", tick);
    els.autoBtn.addEventListener("click", () => {
        info.running = !info.running;
        clearTimeout(info.timeout);
        if (info.running) {
            els.autoBtn.innerHTML = "Pause";
            autoTick();
        } else {
            els.autoBtn.innerHTML = "Run Sim";
        }
    });
    els.speedEl.addEventListener('change', () => {
        info.speed = +els.speedEl.value;
        // dispatch()
    })
    BASE.sub('RM_PURCHASED', (rm) => {
        const {unitCost = 0} = rm;
        info.cash -= unitCost;
        updateCash(info.cash);
        // if info.cash < 0 throw Error"end of sim"
    })
};
