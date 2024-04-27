import assert from "assert";
import BASE from "../base.js";

describe("pub sub", () => {
    const data = [];
    const subFn = (msg) => {
        data.push(msg);
        // console.log(data, message);
    }

    it("should note subscribed messages", () => {
        BASE.sub("Subject1", subFn);
        BASE.pub("Subject1", "Note this Message");
        BASE.pub("Subject1", "Note this Message");
        
        assert.equal(2, data.length, "Expected two messages");
        assert(data.includes("Note this Message"));
        data.shift();
        data.shift();
    })
    
    it("should ignore unsubscribed messages", () => {
        BASE.sub("Subject1", subFn);
        BASE.pub("Subject2", "Ignore this Message");

        assert.equal(0, data.length);
        assert(!data.includes("Ignore this Message"));
    })

    it("should unsubscribe correctly", () => {
        const unsub = BASE.sub("Subject3", subFn);
        BASE.pub("Subject3", "New Message1");
        unsub();
        BASE.pub("Subject3", "New Message2");

        assert.equal(1, data.length);
        assert(data.includes("New Message1"));
        assert(!data.includes("New Message2"));
    })
})