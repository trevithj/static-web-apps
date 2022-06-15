/* Control Sequence Initiator */
const csi = '\x1b['
const style = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  fontDefault: '\x1b[10m',
  font2: '\x1b[11m',
  font3: '\x1b[12m',
  font4: '\x1b[13m',
  font5: '\x1b[14m',
  font6: '\x1b[15m',
  imageNegative: '\x1b[7m',
  imagePositive: '\x1b[27m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  grey: '\x1b[90m',
  gray: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  'bgBlack': '\x1b[40m',
  'bgRed': '\x1b[41m',
  'bgGreen': '\x1b[42m',
  'bgYellow': '\x1b[43m',
  'bgBlue': '\x1b[44m',
  'bgMagenta': '\x1b[45m',
  'bgCyan': '\x1b[46m',
  'bgWhite': '\x1b[47m',
  'bgGrey': '\x1b[100m',
  'bgGray': '\x1b[100m',
  'bgBrightRed': '\x1b[101m',
  'bgBrightGreen': '\x1b[102m',
  'bgBrightYellow': '\x1b[103m',
  'bgBrightBlue': '\x1b[104m',
  'bgBrightMagenta': '\x1b[105m',
  'bgBrightCyan': '\x1b[106m',
  'bgBrightWhite': '\x1b[107m'
}

function colourText(fgColor, bgColor, text) {
	return [style.bold, fgColor, bgColor, text, style.reset].join('');
}

const redText = (text) => colourText(style.red, style.bgCyan, text);
const yellowText = (text) => colourText(style.yellow, style.bgBlue, text);
const greenText = (text) => colourText(style.green, style.bgMagenta, text);
const magentaText = (text) => colourText(style.magenta, style.bgGreen, text);
const cyanText = (text) => colourText(style.cyan, style.bgRed, text);
const blueText = (text) => colourText(style.blue, style.bgYellow, text);
const blackText = (text) => colourText(style.black, style.bgWhite, text);

const goto = (n = 1, m = 1) => [csi, n, ';', m, 'H'].join('');
const toCol = (n) => [csi, n, 'G'].join('');
const clearScreen = () => console.log(`${csi}2J`);
function onKeypress(callback, skipCancel = false) {
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
		if ( !skipCancel && key === '\u0003' ) {
			console.log('\nDone')
			process.exit();
		} else { //pass the key to the callback function
			callback(key);
		}
	});
}

/*
clearScreen();
console.log(goto(5,1) + 'So this is Christmas day?');
console.log('So this is ' + redText('Christmas') + ' day?');
console.log('So this is ' + yellowText('Christmas') + ' day?');
console.log('So this is ' + greenText('Christmas') + ' day?');
console.log('So this is ' + magentaText('Christmas') + ' day?');
console.log('So this is ' + cyanText('Christmas') + ' day?');
console.log('So this is ' + blueText('Christmas') + ' day?');
console.log('So this is ' + blackText('Christmas') + ' day?');

console.log(goto() + 'Home');
console.log(goto(3) + 'Row 3');
console.log(goto(20,1));
onKeypress(key => {
	console.log(`${goto(20)} Key="${key}"`);
});
*/
module.exports = {
	redText, greenText, blueText, yellowText, cyanText, magentaText,
	goto, toCol,
	clearScreen, onKeypress,
}
