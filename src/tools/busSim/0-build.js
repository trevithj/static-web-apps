const builder = require('builder.js');

//builder.setMaxFileAgeDays(100);
builder.setMaxFileAgeHours(12);
builder.setTargetPath("tools/busSim/");

builder.doBuild([
	"index.html",
	"busSim.js",
	"busSim.state.js",
	"busSim.view.js"
]);
