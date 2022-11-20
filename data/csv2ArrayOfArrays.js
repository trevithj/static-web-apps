const fs = require('fs');

//convert csv into json form - array of arrays
//assume 1st row of csv holds array of column name strings
//all subsequent rows contain arrays of matching values

const fileName = 'plantings/trees.csv';
const DELIM = '|'; //'\t';

fs.readFile(fileName, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  const lines = data.split('\n')
  .map(l => l.trim())
  .filter(l => l !=='')
  .map(l => l.split(DELIM));
  console.log('[');
  lines.forEach(
		line => console.log(`  ${JSON.stringify(line)},`)
  );
  console.log(']');
});
