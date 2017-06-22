(function() {
	var display = $('#display');
	var bus = $('#theBus');

	//renderer
	BASE.listen("STATE_CHANGED", function(state) {
		//todo
		//console.log(state.actionType);
		display.text(state.message);
		if(state.isValidLoc) {
			var loc = state.location;
			var x = 120 * loc.x;
			var y = 120 * (4-loc.y);
			bus.attr("transform", `translate(${x},${y})`);
		}
	});

}());
