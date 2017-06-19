const fs = require('fs');
const exec = require('child_process').exec;

function jshint() {
	exec('jshint busSim*.js', function(err, stdout, stderr) {
		if(err) {
			console.log(stdout, stderr);
		} else {
			console.log(`OK: ${new Date().getTime()}`);
		}
	});
}
var opts = {interval:2000};

fs.watchFile('busSim.view.js', opts, jshint);
fs.watchFile('busSim.state.js',opts, jshint);
fs.watchFile('busSim.js', opts, jshint);
