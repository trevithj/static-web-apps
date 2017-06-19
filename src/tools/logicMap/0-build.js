var builder = require('builder.js');

builder.setMaxFileAgeHours(12);
builder.setTargetPath("tools/default/");

builder.doBuild([
	"index.html",
	"main.js",
	"state.js",
	"view.js"
]);
