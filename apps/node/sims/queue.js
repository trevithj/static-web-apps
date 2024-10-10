// Here's a basic example of a queue simulation in JavaScript. This script will create a queue, add customers to it, and then process them one by one.

function makeQueue() {
    const items = [];

    // Add an element to the queue with a priority
    const enqueue = (element) => {
        items.push(element);
    }

    // Remove an element from the queue
    const dequeue = () => {
        return isEmpty() ? "Queue is empty" : items.shift();
    }

    // Check if the queue is empty
    const isEmpty = () => items.length === 0;

    // View the first element in the queue
    const front = () => {
        return isEmpty() ? "Queue is empty" : items[0];
    }

    // View all elements in the queue
    const printQueue = () => {
        return items.join(", ");
    }

    return { printQueue, front, dequeue, enqueue };
}

// Create a new queue
const customerQueue = makeQueue();

function *countdown(start) {
    while (start > 0) {
        start -= 1;
        yield start;
    }
}

const counter = countdown(30);
for(let count of counter) {
    if (Math.random() > 0.5) customerQueue.enqueue(`Customer ${count}`);
    if (Math.random() > 0.5) customerQueue.enqueue(`Customer ${count}`);
    // if (Math.random() > 0.5) customerQueue.enqueue(`Customer ${count}`);
    console.log("Processing: " + customerQueue.dequeue());
    console.log("Queue: " + customerQueue.printQueue());
}
// Add customers to the queue
// customerQueue.enqueue("Customer 1");
// customerQueue.enqueue("Customer 2");
// customerQueue.enqueue("Customer 3");

// Process customers
// console.log("Queue: " + customerQueue.printQueue());
// console.log("Processing: " + customerQueue.dequeue());
// console.log("Queue: " + customerQueue.printQueue());
// console.log("Processing: " + customerQueue.dequeue());
// console.log("Queue: " + customerQueue.printQueue());
// console.log("Processing: " + customerQueue.dequeue());
// console.log("Queue: " + customerQueue.printQueue());

// This script defines a `Queue` class with methods to add (`enqueue`), remove (`dequeue`), and check the status of the queue. It then creates a queue, adds three customers, and processes them one by one, printing the state of the queue at each step.
