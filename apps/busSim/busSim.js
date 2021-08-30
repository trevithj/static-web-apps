(function() {

	//basic pattern
	BASE.listen("SOMETHING_HAPPENED", function(data) {
		BASE.dispatch("DO_SOMETHING", {});
	});

}());
