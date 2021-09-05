(function() {

	///// Reducers /////
  function errorR(state, action) {
    return (action.type==='ERROR') ? action.payload : state.error;
  };
  
  function positionR(state, action) {
    console.log({action});
    return (action.type==='POSITION_CHANGED') ? action.payload : state.position;
  };

  function watchR(state, action) {
    switch (action.type) {
      case 'WATCHING': return action.payload;
      case 'UNWATCHING': return -1;
      default: return state.watch;
    }
  };


	function reducer(state, action) {
		state = state || {
      error: '',
      position: {},
      watch:-1,
    };
		return {
			actionType: action.type,
      error: errorR(state, action),
      position: positionR(state, action),
      watch: watchR(state, action),
		};
	};


	BASE.listen("OK_2_INIT_STATE", function() {
		BASE.initState(reducer);
	});

}());
