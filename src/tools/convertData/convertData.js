
//basic pattern
BASE.listen("SET_DATA", function(txt) {
	localStorage.setItem("RawData", txt);
	BASE.dispatch("SET_DATA", txt);
});

//
BASE.listen("SET_VIEW", function(view) {
	if (view==="Stats") {
		BASE.dispatch("CALC_STATS");
	}
	BASE.dispatch("SET_VIEW", view);
});


//init
BASE.dispatch("SET_VIEW", "Input");
