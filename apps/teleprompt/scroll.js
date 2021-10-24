/*global document, window, event */
(function(){
	function scroll(element, control) {
		function log(msg) {
			if(control) { control.innerHTML = `<pre>${JSON.stringify(msg)}</pre>`; }
			else console.log(msg);
		};
		
		log('scroll');
		let scrolling = null;
		let inc = 3;
		const wait = 150;
		window.DEBUG = { style: element.style };

		const getYpos = function() {
			const ypos = element.offsetTop;
			let thisNode = element; 
			while (thisNode.offsetParent &&  (thisNode.offsetParent !== document.body)) { 
				thisNode = thisNode.offsetParent;
				ypos += thisNode.offsetTop; 
			}
			return ypos;
		};

		const doScroll = function() {
			let y = parseInt(getYpos(),10);
			log({y, inc});
			y=y-inc;
			setStyle(y, `top ${wait}ms linear`);
			scrolling = window.setTimeout(doScroll, wait);
		};

		function setStyle(y, txtn) {
			element.style.top = `${y}px`;
			element.style.WebkitTransition = txtn;
			element.style.MozTransition = txtn;
		}

		function toggleScrolling() {
			if (scrolling) {
				window.clearTimeout(scrolling);
				scrolling = null;
			} else {
				doScroll();
			}
		};
		
		function reset() {
			window.clearTimeout(scrolling);
			scrolling = null;
			setStyle(0, '');
		};

	// 'keys' code adapted S5 (http://www.meyerweb.com/eric/tools/s5/)
	//	which was in turn adapted from MozPoint (http://mozpoint.mozdev.org/)

		const keys = (key) => {
			if (!key) {
				key = event;
				key.which = key.keyCode;
			}
			log(key.which);
			switch (key.which) {
				case  38:	// up arrow
				case 107:	// keypad +
				case 221:	// ]
					if (scrolling) inc++;
				break;
				case  40:	// dn arrow
				case 109:	// keypad -
				case 219:	// [
					if (scrolling && inc>1) inc--;
				break;
				case 10:	// return
				case 13:	// enter
				case 32:	// space
					toggleScrolling();
				break;
				case 27:	// esc
				case 36:	// home
					reset();
				break;
			}
			return false;
		};

		document.addEventListener('click', toggleScrolling);
		document.addEventListener('keyup', keys);		
	};/// End of scroll()

	function init() {
		console.log('init');
		const speechDiv = document.getElementById("speech");
		const controlDiv = document.getElementById("control");
		if (speechDiv) {
			scroll(speechDiv, controlDiv);
		}
	};
	window.addEventListener('canInit', init);
}());
