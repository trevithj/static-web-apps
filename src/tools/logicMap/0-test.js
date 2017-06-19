/*jshint esversion: 6 */
const fs = require('fs');
const exec = require('child_process').exec;

function jshint() {
	exec('jshint [vsm]*.js', function(err, stdout, stderr) {
		if(err) {
			console.log(stdout, stderr);
		} else {
			console.log(`OK: ${new Date().getTime()}`);
		}
	});
}
var opts = {interval:2000};

fs.watchFile('view.js', opts, jshint);
fs.watchFile('state.js',opts, jshint);
fs.watchFile('main.js', opts, jshint);
