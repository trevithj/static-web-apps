function generateCustomers(customers, time) {
    const newCustomers = [];
    const numCustomers = Math.floor(Math.random() * 3);

    for (let i = 0; i < numCustomers; i++) {
        const customer = {id: customers.length + 1, arrival: time };
        customers.push(customer);
        newCustomers.push(customer);
        console.log(`New customer ${customer.id} arrived`);
    }
    return newCustomers;
}

function Simulation(maxTicks = 100) {
    const customers = [];
    const queue= [];
    let time= 0;
    let isRunning= false;


    const start = () => {
        isRunning = true;
        tick();
    }

    const stop = () => {
        isRunning = false;
    }

    function tick() {
        if (!isRunning) {
            console.log(customers);
            return;
        }

        // Generate new customers and add them to the queue
        const newCustomers = generateCustomers(customers, time);
        queue.push(...newCustomers);

        // Serve customers from the queue
        const servedCustomer = queue.shift();
        if (servedCustomer) {
            console.log(`Serving customer ${servedCustomer.id}`);
            servedCustomer.served = time;
        }

        // Update simulation time
        time++;
        console.log("tick:", time);

        // Repeat simulation after a delay (e.g., 1 second)
        setTimeout(() => tick(), 500);

        if(time > maxTicks) stop();
    }

    return { start, stop };
}

// Usage example
const simulation = Simulation(50);
simulation.start();
