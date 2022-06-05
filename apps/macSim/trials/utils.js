const { style, cursor } = require('./ansi.js');

function lTrim(n, chars) {
  return `________${n}`.slice(-chars);
}

function displayMac(mac) {
	status = mac.status.substring(0,3);
  const sTime = lTrim(mac.counter, 3);
  return style.text(`${mac.op}-${status}:${sTime}  `, style.brightBlue);
}

function displayState(state) {
  const { mac, store, ops, count } = state;
  const sCount = lTrim(count, 4);
  const sM0 = `M0: ${displayMac(mac[0])}`;
  const sM1 = `M1: ${displayMac(mac[1])}`;
  const display = [
		'Running', '---------------',
		style.text(sCount, style.brightYellow),
		sM0,
		sM1,
		store.values(),
  ];
	//console.log(`${sCount}  ${sM0}  ${sM1}  ${store.values()}`);
	console.log(display.join('\n'));
	console.log(cursor.previousLine(display.length +1));
}
displayState.done = function() {
	console.log(cursor.nextLine(10), style.text('Done', style.bgBlue ));
}

exports.lTrim = lTrim;
exports.displayMac = displayMac;
exports.displayState = displayState;
