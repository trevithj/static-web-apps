(function() {
	var DIR = {
		NORTH: {dx:0, dy: 1, left:"WEST",  right:"EAST"},
		SOUTH: {dx:0, dy:-1, left:"EAST",  right:"WEST"},
		EAST: { dx: 1,dy: 0, left:"NORTH", right:"SOUTH"},
		WEST: { dx:-1,dy: 0, left:"SOUTH", right:"NORTH"}
	};//assumes 0,0 is SW corner, 4,4 is NE corner

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
		var newLoc = {
			x: loc.x + dirObj.dx,
			y: loc.y + dirObj.dy
		};
		return (locCheck(newLoc)) ? newLoc : loc;
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

	function locSame(newL, oldL) {
		return (newL.x === oldL.x && newL.y === oldL.y);
	}

	function messageR(newS, oldS, type) {
		switch(type) {
			case "MOVE":
				return locSame(newS.location, oldS.location) ? "Bad Move" : "OK";
			case "PLACE":
			case "SET_DIR":
				if (!newS.isValidDir) { return "Direction is invalid"; }
			case "SET_LOC":
				return (newS.isValidLoc) ? "OK" : "Location is invalid";
			default: return "OK";
		}
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
		newState.isValidDir = isValidDirR(action);
		newState.isValidLoc = isValidLocR(action);
		newState.message = messageR(newState, state, action.type);
		return newState;
	});


}());
