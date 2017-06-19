const Browser = require('zombie');


Browser.localhost('example.com', 8888);

const browser = new Browser();

browser.visit('/tools/busSim/index.html', function() {
	console.log(browser.location.href);
	browser.assert.success();
	browser.assert.text('title', 'Bus in Carpark Simulator');

	var BASE = browser.window.BASE;
	console.log(BASE.getState());

	BASE.dispatch("", "");

});

//browser.assert.text('title', 'My Awesome Site');
