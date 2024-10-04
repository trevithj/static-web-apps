/*
Looking at a way to implement the Gauss Jordan techniques of matrix solving.
To start with, just implement basic Row operations.
*/

export  function makeRow(values) {
    if(!Array.isArray(values))
        throw new Error("Function requires an array of numbers.");
    // TODO: implement scale and clone functions that each take a numerical constant.
    const scale = factor => {
        const newVals = values.map(v => v * factor);
        return makeRow(newVals);
    }

    const add = (row, factor = 1) => {
        if(row.values.length !== values.length) {
            throw new Error("Rows must be the same length.");
        }
        const newRow = row.scale(factor);
        const newVals = newRow.values.map((v, i) => {
            const v2 = values[i];
            return v + v2;
        })
        return makeRow(newVals);
    }

    const toString = () => values.join(",");
    return { values, scale, add, toString }
}

