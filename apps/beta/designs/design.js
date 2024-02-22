const input = `My Awesome Sketch
  First State
    some event -> Second State
  Second State
    same event -> Second State
    other event -> First State
`;

const input2 = `Minimal net
1 First State
2 Second State
# Edges below
1 2 some event
2 2 same event
2 1 other event
`;

function parserFactory(options = { type: "simple"}) {
    const toArray = txt => txt.split("\n").flatMap(line => {
        line = line.trimEnd();
        return line.length===0 ? [] : line;
    });
    if(options.type === "simple") {
        return (txt = "") => {
            const pairs = txt.split("\n#");
            if (pairs.length !== 2) return {err:"no edge divider found"};
            const nodes = toArray(pairs[0])
            .map(line => line.split(/\s+/))
            .map(cells => {
                const [id, ...rest] = cells;
                const name = rest.join(" ");
                return [id, name];
            });
            const links = toArray(pairs[1])
            .map(line => line.split(/\s+/))
            .map(cells => {
                const [id1, id2, ...rest] = cells;
                const label = rest.join(" ");
                return [id1, id2, label];
            });
            return { nodes, links };
        }
    }
    return null;
}

const parseInput = parserFactory({ type:"simple"});

function convert(txt="") {
    const parsed = parseInput(txt);
    if (parsed.length === 0 ) return "digraph {}";
    const result = [
        "digraph {",
        `    label = "${parsed[0]}"`,
        "}"
    ];
    return result.join("\n");
}

module.exports = { parseInput, convert };
