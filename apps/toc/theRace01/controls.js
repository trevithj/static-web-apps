const display = (data, element) => () => {
    element.textContent = [
        `Time:  ${data.time}`,
        `Cash: $${data.cash}.`,
        data.message
    ].join("\r\n");
}

export function getData(initialCash = 1000, element) {
    const dt = new Date("2000-01-01T00:00");
    const refTime = dt.getTime();
    const vals = {
        cash: initialCash,
        ticks: 0,
        message: null
    }
    function updateCash(d) {
        vals.cash += d;
        if (vals.cash < 0) vals.message = "You are bankrupt!";
    }

    const DATA = {
        get time() {
            return dt.toTimeString().substring(0, 5);
        },
        get cash() {return vals.cash;},
        updateCash,
        get ticks() {return vals.ticks;},
        tick() {
            vals.ticks += 1;
            dt.setTime(refTime + 60000 * vals.ticks);
        },
        get hasFailed() {return vals.cash < 0;},
        get message() {return vals.message;},
        job: "a0",
        worker: "ready"
    };
    DATA.display = display(DATA, element);
    DATA.isReady = id => DATA.job === id && DATA.worker === "ready";
    return DATA;
}
