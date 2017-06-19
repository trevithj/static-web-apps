const builder = require('builder.js');

builder.setMaxFileAgeDays(1);
builder.setTargetPath("tools/convertData/");

builder.doBuild([
	"index.html",
	"convertData.js",
	"convertData.state.js",
	"convertData.view.js"
]);
