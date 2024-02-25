const { parseInput, convert } = require("./design");

const input = `My Awesome Sketch
  First State
    some event -> Second State
  Second State
    some event -> Second State
    other event -> First State
`;

const input2 = `
a First State
b Second State
#
a b some event
b b same event
b a other event
`; // simple net

/* In-between data structure?
nodes: [
    ["a","First State"],
    ["b","Second State"]
],
links: [
    ["a","b","some event"],
    ["b","b","same event"],
    ["b","a","other event"]
]
*/

const result = `
digraph {
    label = "My Awesome Sketch";
    a [label="First State"]
    b [label="Second State"]
    a -> b [label="some event"]
    b -> b [label="same event"]
    b -> a [label="other event"]
}
`;

const result2 = `
digraph {
    label = "My Awesome Sketch"
    node [color="blue"]
    a [label="First State"]
    b [label="Second State"]
    node [color="silver" shape="box" fontsize="10pt"]
    ab [label="some event"]
    bb [label="same event"]
    ba [label="other event"]
    a -> ab
    ab -> b
    b -> bb
    bb -> b
    b -> ba
    ba -> a
}
`; // use a bipartite digraph

test.skip("conversion function", () => {
    expect(convert()).toEqual("digraph {}");
    expect(convert(input)).toEqual('digraph {\n    label = "My Awesome Sketch"\n}')
});

test("parseInput function", () => {
    expect(parseInput().err).toEqual("no edge divider found");
    expect(parseInput("  Name   ").err).toEqual("no edge divider found");
    const result = parseInput(input2);
    expect(result.nodes[0]).toEqual(["a", "First State"]);
    expect(result.links[0]).toEqual(["a", "b", "some event"]);
});

