// tickFn takes the tickCount value, and returns a boolean: 
// where true means keep running, false means exit the run.
export function SimController(tickFn, tickTime = 1000) {
    let isRunning = false;
    let tickCount = 0;
    let interval;

    // Optionally pass a tick function at this point. This is for cases where
    // the tick function needs to monitor the simulator instance.
    const start = (newTickFn) => {
        if (!isRunning) {
            tickFn = newTickFn || tickFn;
            isRunning = true;
            simulate();
        }
    }
    const stop = () => {
        if (isRunning) {
            isRunning = false;
            clearInterval(interval);
            console.log("stopped");
        }
    }

    const setTickTime = ms => {
        tickTime = Math.abs(ms);
    }

    const simulate = () => {
        if (!isRunning) {
            return;
        }
        interval = setTimeout(() => {
            const keepRunning = tickFn(tickCount);
            if (keepRunning) {
                tickCount += 1;
                simulate();
            } else {
                stop();
            }
        }, tickTime);
    }

    return {
        start, stop, setTickTime,
        get clock() {
            return tickCount;
        },
        get status() {
            return isRunning ? "running" : "stopped";
        }
    }
}
