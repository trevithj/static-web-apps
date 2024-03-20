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

it("should fail", () => {
    const parsed = structureParser(data1);
    console.log(parsed);
    assert(parsed !== null);
})