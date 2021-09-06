(function() {

  function averagesR(state, action) {
    const INIT_AVGS = { latSum:0, lngSum:0, altSum:0, timestamp:0, count:0 };
    const avgs = state.averages || INIT_AVGS;
    if (action.type==='POSITION_CHANGED') {
      const {latitude, longitude, altitude } = action.payload;
      const newState = {...avgs};
      newState.lngSum += longitude;
      newState.latSum += latitude;
      newState.altSum += (altitude || 0); //may be null
      newState.count += 1;
      newState.timestamp = Date.now();
      console.log(newState);
      return newState;
    } else if (action.type==='RESET_AVERAGES') {
      return INIT_AVGS;
    } else {
      return avgs;
    }
  };

  function pointsR(state, action) {
    const {points = [], averages} = state;
    if (action.type==='ADD_CURRENT_POINT') {
      const {lngSum, latSum, altSum, count, timestamp} = averages;
      if(count < 1) return points;
      const newPoint = [lngSum/count, latSum/count, altSum/count, timestamp];
      return [...points, newPoint];
    } else {
      return points;
    }
  };

  BASE.value('averagesR', averagesR);
  BASE.value('pointsR', pointsR);

}());
