(function() {
	var display = document.querySelector('#display');
	var bus = document.querySelector('#theBus');

	//renderer
	BASE.listen("STATE_CHANGED", function(state) {
		//todo
		//console.log(state.actionType);
		display.innerHTML = state.message;
		if(state.isValidLoc) {
			var loc = state.location;
			var x = 120 * loc.x;
			var y = 120 * (4-loc.y);
			bus.setAttribute("transform", `translate(${x},${y})`);
		}
	});

}());
