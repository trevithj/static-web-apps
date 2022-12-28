(function () {
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
        weekEl: BASE.select('#week'),
        dateEl: BASE.select('#date'),
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
        const week = Math.floor(time / 2400);
        const day = Math.floor(time / 480);
        const hour = fmt(Math.floor(time / 60));
        const min = fmt(time % 60);

        // const tod = 
        info.timeEl.innerHTML = `
            <p>Week:<span>${week + 1}</span></p>
            <p>Day:<span>${day + 1}</span></p>
            <p>Time:<span>${hour}:${min}</span></p>
        `.trim();
    }
    function updateCash() {
        info.cashEl.innerHTML = `
        <p>Cash on hand:<span>$${info.cash}</span></p>
        `.trim();
    }
    function tick() {
        BASE.send('NEXT_STEP', info);
        info.time += 1;
        updateTime();
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
    info.speed = +info.speedEl.value;

    BASE.logging = true;

    info.nextBtn.addEventListener("click", tick);
    info.autoBtn.addEventListener("click", () => {
        info.running = !info.running;
        clearTimeout(info.timeout);
        if (info.running) {
            info.autoBtn.innerHTML = "Pause";
            autoTick();
        } else {
            info.autoBtn.innerHTML = "Run Sim";
        }
    });
    info.speedEl.addEventListener('change', () => {
        info.speed = +info.speedEl.value;
    })
    BASE.listen('RM_UPDATED', (rm) => {
        const {unitCost = 0} = rm;
        info.cash -= unitCost;
        updateCash(info.cash);
        // if info.cash < 0 throw Error"end of sim"
    })

}());
