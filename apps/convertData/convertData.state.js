//useful helper function
function setProp(prop, type, action) {
    return (action.type === type) ? action.payload : prop;
}

//check for and remove duplicates, add a row-count field
function collapseDuplicateLines(lines) {
    var map = {}, titleRow = "_rows\t";
    lines.forEach(function (line, r) {
        if (r === 0) {
            titleRow += line;
        } else {
            var count = map[line] || 0;
            map[line] = count + 1;
        }
    });
    lines = Object.keys(map).map(function (key) {
        var count = map[key];
        return count + "\t" + key;
    });
    lines.unshift(titleRow);
    return lines;
}

function setRowHeadings(state, action) {
    var v = state.rowHeadings || [];
    if (action.type === "SET_DATA") {
        var i = action.payload.indexOf("\n");
        var line1 = action.payload.substr(0, i);
        v = line1.split("\t");
    }
    return v;
}

function setRowCount(state, action) {
    var v = state.rowCount || 0;
    if (action.type === "SET_DATA") {
        var i = action.payload.indexOf("\n");
        var line1 = action.payload.substr(0, i);
        v = line1.split("\t");
    }
    return v;
}

function setData(state, action) {
    var dt = state.data || [{name: "Empty", data: []}];//array of column objects
    if (action.type === "SET_DATA") {
        dt = []; //new array
        var lines = action.payload.split("\n");
        if (state.collapseDuplicates) {
            lines = collapseDuplicateLines(lines);
        }
        lines.forEach(function (line, r) {
            var cells = line.split("\t");
            cells.forEach(function (cell, c) {
                if (r === 0) {
                    dt.push({name: cell, data: []});
                } else {
                    var v = isNaN(cell) ? cell : +cell;
                    dt[c].data.push(v);
                }
            });
        });
    }
    return dt;
}

function getUniqueValuesMap(da) {
    var unique = {};
    da.forEach(function (d) {
        if (unique[d] === undefined) {
            unique[d] = 0;
        }
        unique[d] += 1;
    });
    return unique;
}

function getDataTypes(da) {
    var types = {String: 0, Number: 0, Null: 0};
    da.forEach(function (d) {
        var type = "Null";
        switch (typeof d) {
            case "number":
                type = (isNaN(d)) ? "Null" : "Number";
                break;
            case "string":
                type = (isNaN(d)) ? "String" : "Number";
                type = (d === "") ? "Null" : type;
                break;
            //				default: type = "Null";
        }
        types[type] += 1;
    });
    return types;
}

function setStats(state, action) {
    var dt = state.stats || {};
    if (action.type === "CALC_STATS") {
        dt = {
            columnNames: state.data.map(function (d) {
                return d.name;
            }),
            uniqueMaps: state.data.map(function (d) {
                return getUniqueValuesMap(d.data);
            }),
            dataTypes: state.data.map(function (d) {
                return getDataTypes(d.data);
            })
        };
        dt.uniqueValues = dt.uniqueMaps.map(function (d) {
            var vals = Object.keys(d).map(function (v) {
                return isNaN(v) ? v : +v;
            });
            return vals.sort(function (a, b) {
                if (a == b) return 0;
                return (a < b) ? -1 : 1;
            });
        });
    }
    return dt;
}

// //set up reducer
// BASE.initState(function (state, action) {
function reducer(state, action) {
    state = state || {};
    return {
        view: setProp(state.view || "Input", "SET_VIEW", action),
        data: setData(state, action),
        rowCount: setRowCount(state, action),
        colHeadings: setRowHeadings(state, action),
        collapseDuplicates: true,
        stats: setStats(state, action),
        actionType: action.type
    };
};

export {reducer};
