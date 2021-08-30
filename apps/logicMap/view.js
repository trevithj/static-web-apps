/*jshint esversion: 6 */
(function() {
	const display = document.querySelector("#display");

	function getToolbar(state) {
		var views = state.views;
		var divs = views.map((v) => {
			var actv = (v===state.view) ? "tab-active" : "";
			return `<div class="col-sm-2 tab ${actv}">
				<a href="#" onclick="BASE.dispatch(\'SET_VIEW\',\'${v}\')">${v}</a>
			</div>`;
		});
		var spc = 12 - (2*views.length);
		return `<div class="row">
			${divs.join("")}
			<div class="col-sm-${spc} tab tab-space">&nbsp;</div>
		</div>`;
	}
	function getMainDisplay(state) {
		return `<h2>${state.view} Pending</h2>`;
	}

/*
	display.html(`<table style="width:100%"><tr>
	<th style="width:30%">Text Input</th>
	<th style="width:70%">Display</th>
	</tr><tr>
	<td><textarea id="mainInput"></textArea></td>
	<td><svg><g id="mainGraph"></g></svg></td>
	</tr></table>
	`);
	const input = display.find("#mainInput");
	const svg = display.find("svg");
	const graph = display.find("#mainGraph");
	//init
	input.css("height", `${screen.availHeight*0.6}px`);
	input.css("width", `${window.innerWidth*0.34}px`);
	svg.attr("height", screen.availHeight*0.6);
	svg.attr("width", window.innerWidth*0.6);
//	graph.css("height", `${screen.availHeight*0.6}px`);
//	graph.css("width", `${window.innerWidth*0.6}px`);
*/
	//renderer
	BASE.listen("STATE_CHANGED", function(state) {
//		console.log(state);
		display.innerHTML = `${getToolbar(state)}	${getMainDisplay(state)}`;
	});

}());
