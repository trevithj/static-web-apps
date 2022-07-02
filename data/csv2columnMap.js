const fs = require('fs');

//convert csv into 'column-table' json form
//assume 1st row of csv holds column names
//returns map of column:string -> values:any[].

const fileName = 'plantings.csv';
const DELIM = '\t';

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
			vals.reduce((map, val) => {
				map[val] = [];
				return map;
			}, theMap);
		} else {
			fields.forEach((key, i) => {
				const val = vals[i] || '';
				theMap[key].push(val);
			});
		}

	});
  console.log(JSON.stringify(theMap));
});
