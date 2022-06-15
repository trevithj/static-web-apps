# Machine simulator
Simulates a single resource running one of two operations.
 
This is a test for ways to represent BOM and RES data that are easy to calculate.

A discrete-time simulator, it will advance in a series of time steps, with the state at each point being the result of the previous state and any user-input.

Possible scenarios to start with:

RM1 --> W1:5 --> U1:20 --> SELL
RM2 --> W2:5 --> V2:20 --> SELL
Only one resource U,V,W. Setup 180.

Do this in Node first?

### Schema 

Both store and ops can be maps.
Each op consists of:
* numerical setup and time values, representing number of ticks to get ready and to process a single unit.
* fedby and fedto arrays holding a required materials object: {mat:string (materialId), qty:number (units-required) }
The store has push, peek and pull methods, allowing the sim to access a qty of a material by id.

### Sim

The core of the sim is a generator function that returns a custom iterator for each machine.
Each iteration represents a single tick, and the iterator updates the machine's state based on the following state-chart:
```
READY
  currentOp===null -> READY
  currentOp==set -> SETUP
SETUP
  counter>0 -> SETUP
  counter===0 -> IDLE
IDLE
  currentOp===null -> READY
  soh===0 -> IDLE
  soh > 0 -> RUNNING
RUNNING
  counter>0 -> RUNNING
  counter===0 -> IDLE
```
