// To implement a priority queue where customers with higher priority are served first, we can modify the queue to include a priority value for each customer. Here's an updated version of the queue simulation:

function makePriorityQueue() {
    const items = [];

    // Add an element to the queue with a priority
    const enqueue = (element, priority) => {
        items.push({ element, priority });
        items.sort((a,b) => a.priority - b.priority);
    }

    // Remove an element from the queue
    const dequeue = () => {
        return isEmpty() ? "Queue is empty" : items.shift().element;
    }

    // Check if the queue is empty
    const isEmpty = () => items.length === 0;

    // View the first element in the queue
    const front = () => {
        return isEmpty() ? "Queue is empty" : items[0].element;
    }

    // View all elements in the queue
    const printQueue = () => {
        if(isEmpty()) return "Empty";
        return items.map(item => `${item.element} (priority: ${item.priority})`).join(", ");
    }

    return { printQueue, front, dequeue, enqueue };
}

// Create a new priority queue
const customerQueue = makePriorityQueue();

function makeArray(length) {
    return Array.from({ length}, (_, i) => i);
}

// Add customers to the queue with different priorities
customerQueue.enqueue("Customer 1", 2);
customerQueue.enqueue("Customer 2", 1);
customerQueue.enqueue("Customer 3", 3);
customerQueue.enqueue("Customer 4", 1);

// Process customers
makeArray(4).forEach((v) => {
    console.log("Queue: " + customerQueue.printQueue());
    console.log("Processing: " + customerQueue.dequeue());
})
console.log("Queue: " + customerQueue.printQueue());


// In this version, the `enqueue` method inserts elements into the queue based on their priority. Higher-priority elements (with lower priority values) are placed before lower-priority elements. The `printQueue` method has been updated to display the priority of each customer.

// Source: Conversation with Copilot, 2024-10-08
// (1) github.com. https://github.com/uhjee/TIL/tree/1f5100f9713279a0cd7fd7c167769ccd2dd1b2d8/data-structure%2Fsrc%2Fqueue.js.