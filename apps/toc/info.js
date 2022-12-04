(function(){

    const info = {
        cash: 11000,
        time: 0,
        speed: 0,
        weekEl: BASE.select('#week'),
        dateEl: BASE.select('#date'),
        timeEl: BASE.select('#time'),
        cashEl: BASE.select('#cash'),
        speedEl: BASE.select('#speed'),
    }
    function updateTime() {
        const { time } = info;
        const week = time % 2400;
        const day = time % 480;
        // const tod = 
        info.timeEl.innerHTML = `
            <p>Week:<span>${week}</span></p>
            <p>Day:<span>${day}</span></p>
            <p>Time:<span>08:24</span></p>
        `.trim();
    }
    function updateCash(cash) {
        info.cashEl.innerHTML = `
        <p>Cash on hand:<span>$${cash}</span></p>
        `.trim();
    }
    // Initialize view
    updateTime();
    updateCash(info.cash);

    BASE.listen('RM_UPDATED', (rm) => {
        const { unitCost = 0 } = rm;
        info.cash -= unitCost;
        updateCash(info.cash);
        // if info.cash < 0 throw Error"end of sim"
    })

}());
