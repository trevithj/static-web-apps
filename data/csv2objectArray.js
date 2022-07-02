const fs = require('fs');

//convert csv into json form
//assume 1st row of csv holds column names
//returns array of objects mapping column:string -> value:any.

const fileName = 'birds.csv';
const DELIM = '\t';

fs.readFile(fileName, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  const lines = data.split('\n').map(l => l.trim()).filter(l => l !=='');
  let fields;
  const a = lines.map((line, row) => {
		const def = line.split(DELIM);
		if(row===0) {
			fields = def;
			return def;
		} else {
			return def.reduce((state, value, i) => {
				const key = fields[i];
				if (value.trim() !=='') {
					state[key] = value;
				}
				return state;
			}, {});
		}

	});
  console.log(JSON.stringify(a,null, 2));
});
