(function() {
	var display = $('#display');

	//renderer
	BASE.listen("STATE_CHANGED", function(state) {
		//todo
		//console.log(state.actionType);
		display.html([
			"<h3>",state.actionType,"</h3>"
		].join(""));
	});

}());
