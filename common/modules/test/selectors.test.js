import assert from "assert";
import {NS, makeNSElement} from "../selectors.js";

const mockElement = (type, ns) => {
    const vals = [type, ns];
    return {
        setAttribute: (name, value) => vals.push(name, value),
        get outerHTML () {
            return vals.join("|");
        }
    };
}

// Needs a mocked document object.
globalThis.document = {
    createElementNS: (...args) => mockElement(...args)
};

describe("makeNSElement", () => {
    it("should create mock element", () => {
        const el = makeNSElement(NS.HTML)("div", "class=box", "id=fred");
        assert.equal(el.outerHTML, "http://www.w3.org/1999/xhtml|div|class|box|id|fred");
    })
})
