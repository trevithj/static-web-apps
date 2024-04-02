import assert from "assert"; // built-in Node assertions
import {structureParser} from "../chartEdit.js";

const data1 = `
Draw an SVG Chart
  step1 -> Parse data into graph form
  step2 -> Process data
    Create visual nodes and links
    Layout text nodes
        Position Nouns
        Position Verbs
        forEach try -> Update All Nodes
            forEach node -> Update Node
                Move away from close nodes
                Move toward linked nodes
        Position links
  step3 -> Render result`;

describe("structureParser happy path", () => {
    const {nodes, links, nodeMap} = structureParser(data1);
    it("should parse nodes correctly", () => {
        assert(nodes.length === 13);
        assert(nodeMap.n0 === nodes[0]);
    })

    it("should handle named links", () => {
        assert(links.length === 12);
        const namedLinks = links.filter(l => !!l.label);
        assert(namedLinks.length === 5);
    })
})

const data2 = `
Root node 1
  with -> child
Root node 2
  with -> child
`
describe("structureParser edge cases", () => {

    const {nodes, links, nodeMap} = structureParser(data2);
    it("should parse nodes correctly", () => {
        console.log(links);
        assert(links.length === 2);
        assert(nodes.length === 4);
        assert(nodeMap.n0 === nodes[0]);
    })
})