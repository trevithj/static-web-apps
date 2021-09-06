(function() {

  BASE.value('averagesR', function averagesR(state, action) {
    const INIT_AVGS = { latSum:0, lngSum:0, altSum:0, timestamp:0, count:0 };
    const avgs = state.averages || INIT_AVGS;
    if (action.type==='POSITION_CHANGED') {
      const {latitude, longitude, altitude } = action.payload;
      const newState = {...avgs};
      newState.latSum += latitude;
      newState.lngSum += longitude;
      newState.altSum += (altitude || 0);
      newState.count += 1;
      newState.timestamp = Date.now();
      console.log(newState);
      return newState;
    } else if (action.type==='RESET_AVERAGES') {
      return INIT_AVGS;
    } else {
      return avgs;
    }
  });

}());
