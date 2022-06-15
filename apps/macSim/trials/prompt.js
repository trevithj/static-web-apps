function doKeypress(callback) {
	var stdin = process.stdin;

	// without this, we would only get streams once enter is pressed
	stdin.setRawMode( true );

	// resume stdin in the parent process (node app won't quit all by itself
	// unless an error or process.exit() happens)
	stdin.resume();

	// i don't want binary, do you?
	stdin.setEncoding( 'utf8' );

	// on any data into stdin
	stdin.on( 'data', function( key ){
		// ctrl-c ( end of text )
		if ( key === '\u0003' ) {
			console.log('\nDone')
			process.exit();
		} else { //pass the key to the callback function
			callback(key);
		}
	});
}
///////////TEST EXAMPLE/////////
let run = true;
let pause = false;

doKeypress(key => {
	switch(key) {
		case 'q': run = false; break;
		case 'p': pause = !pause; break;
		case 'r': process.stdout.write('\x1b[42m'); break; //red bg
		case 'c': process.stdout.write('\x1b[0m'); break; //clear color
	} //else ignore
});

const id = setInterval(() => {
	if(!run) {
		clearInterval(id);
		console.log("DONE");
	} else if (!pause) {
		console.log(Math.random());
	}
}, 500);
