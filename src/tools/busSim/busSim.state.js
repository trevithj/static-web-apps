(function() {
	var DIR = {
		NORTH: {dx:0, dy:1, left:"WEST", right:"EAST"},
		SOUTH: {dx:0, dy:-1,left:"EAST", right:"WEST"},
		WEST: { dx:1, dy:0, left:"NORTH", right:"SOUTH"},
		EAST: { dx:-1,dy:0, left:"SOUTH", right:"NORTH"}
	};

	//useful helper function
	function setProp(prop, type, action) {
		return (action.type===type) ? action.payload : prop;
	}

	function locCheck(loc) {
		if(loc.x<0 || loc.x>4) return false;
		if(loc.y<0 || loc.y>4) return false;
		return true;
	}

	function setValidLoc(state, action) {
		var val = state.isValidLoc;
		switch(action.type) {
			case "PLACE":
				return locCheck(action.payload.loc);
			default: return val;
		}
	}

	//set up reducer
	BASE.initState(function (state, action) {
		state = state || {
			location: {x:0, y:0},
			facing: "NORTH",
			isValidLoc: true,
			message: "OK"
		};
		return {
			location: setProp(state.location, "SET_LOC", action),
			facing: setProp(state.facing, "SET_DIR", action),
			isValidLoc: setValidLoc(state, action),
			message: "OK",
			actionType: action.type
		};
	});


}());
