const fs = require('fs');

//convert csv into map of data objects
//assume 1st row of csv holds column names, and first column is a unique key
//returns map of key:string -> values:object.

const fileName = 'trees.csv';
const DELIM = '|';

fs.readFile(fileName, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  const lines = data.split('\n').map(l => l.trim()).filter(l => l !=='');

  const theMap = {};
  let fields;

  lines.forEach((line, row) => {
		const vals = line.split(DELIM).map(v => v.trim());
		if(row===0) {
			fields = vals;
		} else {
			const values = fields.reduce((map, key, i) => {
				if (i===0) return map;
				const val = vals[i];
				if(val) {
					map[key] = val;
				}
				return map;
			}, {});
			//Now map values object to the unique first field value
			theMap[vals[0]] = values;
		}

	});
  console.log(JSON.stringify(theMap, null, 2));
});
