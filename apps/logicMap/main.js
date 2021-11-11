(function() {
	const { menu } = BASE.value('Selectors');
	const theMenu = document.querySelector(menu);

	theMenu.querySelectorAll('button').forEach(btn => {
		btn.addEventListener('click', () => BASE.dispatch('BTN_CLICKED', btn));
	})
	//basic pattern
	BASE.listen("SOMETHING_HAPPENED", function(data) {
		BASE.dispatch("DO_SOMETHING", {});
	});


}());
