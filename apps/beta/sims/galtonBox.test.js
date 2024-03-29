// import { bounce } from "./galtonBoxV2";
const {bounce, bouncer, velocity, displacement} = require("./galtonBoxV2");

test("displacement fn", () => {
    {
        const result = displacement(10, 5);
        expect(result).toEqual([5, 20, 45, 80, 125]);
    }
    {
        const result = displacement(1, 4);
        expect(result).toEqual([0.5, 2, 4.5, 8]);
    }
    {
        const result = displacement(1, 7, -2);
        expect(result).toEqual([-1.5, -2, -1.5, 0, 2.5, 6, 10.5]);
    }
});

test("velocity fn", () => {
    {
        const result = velocity(10, 6, -30);
        expect(result.length).toBe(6);
        expect(result).toEqual([-20, -10, 0, 10, 20, 30]);
    }
});

test("bounce fn", () => {
    const ya = [1, 2, 3, 4, 10];
    {
        const result = bounce(10, ya);
        expect(result.length).toBe(5);
        expect(result[4].x).toBe(10);
        expect(result[4].y).toBe(10);
    }
    {
        const result = bounce(-10, ya);
        expect(result.length).toBe(5);
        expect(result[4].x).toBe(-10);
        expect(result[4].y).toBe(10);
    }
});

test("Bounce iterator", () => {
    //todo: mock the Math.random() fn)
    {
        const it = bouncer({});
        const result = [...it];
        expect(result.length).toBe(3);
        expect(result.map(r => r.dy)).toEqual([0,1,2]);
        expect(result.map(r => r.index)).toEqual([0,0,0]);
    }
    {
        const it = bouncer({levels: 3, balls: 2});
        const result = [...it];
        expect(result.length).toBe(6);
        expect(result.map(r => Math.abs(r.dx))).toEqual([1,1,1,1,1,1]);
        expect(result.map(r => r.dx)).not.toEqual([1,1,1,1,1,1]);
        expect(result.map(r => r.dy)).toEqual([0,1,2,0,1,2]);
        expect(result.map(r => r.index)).toEqual([0,0,0,1,1,1]);
        // console.log(result);
    }
})