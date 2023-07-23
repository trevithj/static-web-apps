import {SimController} from "./simController.mjs";

function makeProcess(id, runTime) {
    return {id, runTime, clock: 0};
}

function Simulation(maxTime = 20) {
    const inputQueue = [];
    const outputQueue = [];
    const processes = [
        makeProcess(1, 3), // Process 1 with processing time of 3 clock ticks
        makeProcess(2, 5)  // Process 2 with processing time of 5 clock ticks
    ];

    function tick(clock) {
        // Process items in the input queue for each process
        processes.forEach(process => {
            if (process.currentItem) {
                process.clock += 1;
                if (process.clock >= process.runTime) {
                    outputQueue.push(process.currentItem);
                    process.currentItem = null; // Reset current item
                }
            }
            
            if (!process.currentItem) {
                // Take a new item from the input queue
                process.currentItem = inputQueue.shift() || null; 
                process.clock = 0;
            }
        });
        processes.forEach((p, i) => {
            if (i === 1)
            console.log(`${simControl.clock + 100}`.substring(1), JSON.stringify(p));
        })
        return clock < maxTime;
    }
    
    const simControl = SimController(tick, 300);
    
    function addItemToInputQueue(id) {
        const item = {id};
        inputQueue.push(item);
        console.log(`New item ${item.id} added to the input queue`);
    }

    // Add some items to the input queue
    ['A', 'B', 'C', 'D', 'E'].forEach(id => {
        addItemToInputQueue(id);
    });

    simControl.start(tick);
}

Simulation(16);
