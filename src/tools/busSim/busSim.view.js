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
			bus.attr("transform", `translate(${loc.x*120},${loc.y*120})`);
		}
	});

}());
