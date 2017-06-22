(function() {
	var DIR = {
		NORTH: {dx:0, dy:-1, left:"WEST",  right:"EAST"},
		SOUTH: {dx:0, dy: 1, left:"EAST",  right:"WEST"},
		WEST: { dx:-1,dy: 0, left:"NORTH", right:"SOUTH"},
		EAST: { dx: 1,dy: 0, left:"SOUTH", right:"NORTH"}
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

	function dirCheck(dir) {
		var dirs = Object.keys(DIR);
		return dirs.indexOf(dir) > -1;
	}

	function doMove(loc, dir) {
		var dirObj = DIR[dir];
		return {
			x: loc.x + dirObj.dx,
			y: loc.y + dirObj.dy
		};
	}

	function doTurn(dir, lr) {
		var dirObj = DIR[dir];
		return dirObj[lr.toLowerCase()];
	}

	function locationR(state, action) {
		var val = state.location || {x:0, y:0};
		var loc = action.payload;
		switch(action.type) {
			case "PLACE":
				loc = action.payload.loc;
			case "SET_LOC":
				return (locCheck(loc)) ? loc : val;
			case "MOVE":
				return doMove(val, state.facing);
			default: return val;
		}
	}

	function facingR(state, action) {
		var val = state.facing || "NORTH";
		var dir = action.payload;
		switch(action.type) {
			case "PLACE":
				dir = action.payload.dir;
			case "SET_DIR":
				return (dirCheck(dir)) ? dir : val;
			case "TURN":
				return doTurn(val, action.payload);
			default: return val;
		}
	}

	function messageR(newState) {
		var msg = (newState.isValidLoc) ? "OK" : "Location is invalid";
		return (newState.isValidDir) ? msg : "Direction is invalid";
	}

	function isValidDirR(action) {
		switch(action.type) {
			case "PLACE":
				return (dirCheck(action.payload.dir));
			case "SET_DIR":
				return (dirCheck(action.payload));
			default: return true;
		}
	}

	function isValidLocR(action) {
		switch(action.type) {
			case "PLACE":
				return (locCheck(action.payload.loc));
			case "SET_LOC":
				return (locCheck(action.payload));
			default: return true;
		}
	}

	//set up reducer
	BASE.initState(function (state, action) {
		state = state || {
			isValidLoc: true,
			isValidDir: true,
			message: "OK"
		};
		var newState = {
			location: locationR(state, action),
			facing: facingR(state, action),
			actionType: action.type
		};
		newState.message = messageR(newState);
		newState.isValidDir = isValidDirR(action);
		newState.isValidLoc = isValidLocR(action);
		return newState;
	});


}());
