# Synapses
Playing with modelling sparse ANNs in JS.

One advantage of a single-threaded language might be to do this like a wargame:
- each node subscribes to two events: trigger and learn.
- the trigger event simply causes any node with sufficient activation to announce itself, then deactivate. Other nodes ignore the event. This is published by the controller.
- the above should yield a list of activated nodes.
- look for any two activated nodes that are joined, and strengthen that connection.

So: local learning only. But...
The structure I am thinking about has two sets of inputs: one for external and one for internal.
If we start with no connections at all, but random activation of internal state, then over time we should see a build-up of connections.

So what?

How is this useful?

Okay, maybe instead we also another learning process:
- look for any two activated nodes that share a common (hidden) node. Strengthen the links between all three, making the middle node more likely to be activated.

Hmm. How does that work? This goes back to the idea of input/output layers, and trying to train them to match. Okay, so what happens?
An input node is activated, and it checks for all fedto nodes.
If any of them are activated, strengthen the link.
Repeat for each of the fedto nodes.

Hm. Maybe work both ways: do the same for each active output node and its fedby nodes.
In which case, only strengthen all links a little bit for all fedbys.

Then every now and then, decrease all links.
What pattern emerges, doing this?

## Test cases
XOR
input:
A  0 1 0 1 
B  0 0 1 1 
Output:
C  0 1 1 0

    A   B
H -.5 -.5
C 1.0 1.0

  H
C 2

Hmm...
Okay, if a node is NOT activated, reduce the links the same way.


Another thought: do random inputs, and simply do a valence check. If good, encourage that pattern by associating it with "good". Ditto if bad. Otherwise, ignore.

Actually, do random activation of the hidden layer nodes.
Maybe try activating the input nodes one at a time, and build up a pattern?






105.69
420.00

284376.17  2024-08-04

1 april 2024  272772.95
my contrbs  3777.57
other contribs  1471.88
red/fees/tax -2685.62
earnings  9039.39

Rabo
133187.20
-17500.00 contribs

115687.20
TODO: note RB accounts separately? Can I download statements?
87978.20 (5.25%) Premium Svr
33209.00 (5.40%) 60 Day saver
(txfr 40000 5 Aug)

Also, time for a new TD?


NZFunds 85714.31
63296.11  contribs
 1178.95  tax rebates
  334.07  fee rebates
20905.26  portfolio gains
========
85714.39

Jarden @ 4 Aug 2024
-$7,289.50  CHANGE SINCE INCEPTION
$14,760.50  HOLDINGS BALANCE (NZD)
$483.90     CASH BALANCE (NZD)
$15,244.40  PORTFOLIO TOTAL (NZD)

22533.90







Options for Monday 2024-08-12
Email reply to KM, HR etc...
Option 1:
Capitulation - accept the rest of the PIP as is.

Option 2:
Stick to guns, push back hard, consider litigation etc.

Option 1.5
Somewhere in the middle, seek to diffuse the escalating defensive loop. Reiterate the situation as I see it, in terms of my trying to engage with the process from the beginning. Describe post-PIP signing etc as examples of my operating in good faith.
Express my frustration at the delay in promised responses (give examples. Mainly last week related to the signing of PIP1, and perhaps KM's intention to check on that.)
Rather upset that the implication is that I am trying to change the process. It is in my interests to complete the process successfully.
Resolution maybe to tie the remaining points back into the JD. Note their long-standing nature, and my patience in this matter.

NOT capitulation, but it doesn't close the door on option 2 either.





