const builder = require('builder.js');

//builder.setMaxFileAgeDays(100);
builder.setMaxFileAgeHours(12);
builder.setTargetPath("tools/sudoku/");

builder.doBuild([
	"index.html",
	"sudoku.state.js",
	"sudoku.view.js"
]);
