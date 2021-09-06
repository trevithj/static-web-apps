(function() {

	///// Reducers /////
  function errorR(state, action) {
    return (action.type==='ERROR') ? action.payload : state.error;
  };
  
  function positionR(state, action) {
    return (action.type==='POSITION_CHANGED') ? action.payload : state.position;
  };

  function tabR(state, action) {
    return (action.type==='TAB_CHANGED') ? action.payload : state.tab;
  };

  function watchR(state, action) {
    switch (action.type) {
      case 'WATCHING': return action.payload;
      case 'UNWATCHING': return -1;
      default: return state.watch;
    }
  };

  const averagesR = BASE.value('averagesR');
  const pointsR = BASE.value('pointsR');

	function reducer(state, action) {
		state = state || {
      error: '',
      points: [],  //each row contains [lng,lat,altitude,timestamp],
      position: {},
      tab: 'position',
      watch:-1,
    };
		return {
			actionType: action.type,
      averages: averagesR(state, action),
      error: errorR(state, action),
      points: pointsR(state, action),
      position: positionR(state, action),
      tab: tabR(state, action),
      watch: watchR(state, action),
		};
	};


	BASE.listen("OK_2_INIT_STATE", function() {
		BASE.initState(reducer);
	});

}());
