import {SimController} from "./simController.mjs";

function showFixed(num) {
    return new Number(num).toFixed(2);
}
const sampleSize = 100;
const defectRate = 0.05;
const stats = {
    defects: 0,
    okays: 0
};

function runs(n) {
    while(n>0) {
        const defective = Math.random() < defectRate;
        if (defective) {
            stats.defects += 1;
        } else {
            stats.okays += 1;
        }
        n -= 1;
    }
}

function tick(clock) {
    runs(1000);
    const running = clock < sampleSize;
    if (!running) {
        // display final results
        console.log(stats);
        const { defects, okays } = stats;
        const total = defects + okays;
        console.log(`Defects: ${showFixed(defects/total*100)}%`)
        console.log(`Okays  : ${showFixed(okays/total*100)}%`)
    }
    return running;
}

const sim = SimController(tick, 0);
sim.start();
console.log(sim.status);
