/*jshint esversion:6 */
export function initState(BASE) {

	//useful helper function
	function setProp(prop, type, action) {
		return (action.type===type) ? action.payload : prop;
	}

	function str2Array(str) {
		return (str) ? str.split(",") : [];
	}

	function str2Link(link) {
		//"[N1,N2][N3]" -> {srcs:["N1","N2"], tgts:["N3"]}
		var tmp, obj = {srcs:[], tgts:[]};
		var sa = link.split("]");
		if(sa.length < 2) {
			console.err(`Bad link string: ${link}`);
		} else {
			tmp = sa[0].split("[");
			obj.srcs = str2Array(tmp[1]);
			tmp = sa[1].split("[");
			obj.tgt = str2Array(tmp[1]);
		}
		return obj;
	}

	function setLinks(links, type, action) {
		if(action.type===type) {
			links = action.payload.map((link) => {
				return str2Link(link);
			});
		}
		return links;
	}


	function setNodes(nodes, type, action) {
		if(action.type===type) {
			nodes = {};
			action.payload.forEach((node) => {
				var sa = node.split(/\s/);
				nodes[sa[0]] = sa[1];
			});
		}
		return nodes;
	}

	function setMode(mode, action) {
		switch(action.type) {
			case 'BTN_CLICKED': return action.payload.name;
			default: return mode;
		}
	}

	//set up reducer
	BASE.initState(function (state, action) {
		state = state || {
			mode:"add",
			view:"Input",
			views: ["Input","Display","Help"],
			nodes: {},
			links: []
		};
		return {
			mode: setMode(state.mode, action),
			view: setProp(state.view, "SET_VIEW", action),
			views: setProp(state.views, "SET_VIEWS", action),
			nodes: setNodes(state.nodes, "SET_NODES", action),
			links: setLinks(state.links, "SET_LINKS", action),
			actionType: action.type
		};
	});

};
