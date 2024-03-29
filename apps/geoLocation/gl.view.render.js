(function () {

  //roll-your-own nullish
  function ifNull(v, other = 'unknown') {return v === null ? other : v;}

  function renderPosition(tab, position) {
    if(tab !=='position') return;
    const {accuracy, latitude, longitude, altitude, altitudeAccuracy, heading, speed} = position;
    view.pos.innerHTML = `
      <h3>Real-time geolocation data</h3>
      <div class='row'>LongLatA : [
        ${Number(longitude).toFixed(8)}, ${Number(latitude).toFixed(8)}, ${Number(ifNull(altitude,0)).toFixed(2)}
      ]</div>
      <div class='row'>Accuracy : ${accuracy}, ${ifNull(altitudeAccuracy, -1)}</div>
      <div class='row'>Heading  : ${ifNull(heading)}</div>
      <div class='row'>Speed    : ${ifNull(speed)}</div>
    `;
  }

  function renderPoints(tab, points) {
    if(tab !=='points') return;
    // console.log({points});
    view.pos.innerHTML = `<h3>Stored points data</h3><textArea>${stringify(points)}</textArea>`;
  }

  function stringify(points) {
    return points.map(p => {
      const [lng=0, lat=0, alt=0, timestamp=0] = p;
      return `${Number(lng).toFixed(8)}, ${Number(lat).toFixed(8)}, ${Number(alt).toFixed(2)}, ${timestamp}`;
    }).join('\n');
  }


  function renderAverages(tab, averages) {
    const {latSum, lngSum, altSum, timestamp, count} = averages;
    const vals = calcAvgs(latSum, lngSum, altSum, count);
    view.avg.innerHTML = `
      <h3>Averaged geolocation data</h3>
      <div class='row'>LongLatA: [${vals}]</div>
      <div class='row'> Counts = ${count}</div>
      <div class='row'> Last update on ${new Date(timestamp).toISOString()} (${timestamp})</div>
    `;
  }

  function calcAvgs(latSum, lngSum, altSum, count) {
    if(count < 1) {
      return '0.00000000, 0.00000000, 0.00'
    } else {
      return `${Number(lngSum/count).toFixed(8)}, ${Number(latSum/count).toFixed(8)}, ${Number(altSum/count).toFixed(2)}`;
    }
  }

  BASE.value("renderPosition", renderPosition);
  BASE.value("renderPoints", renderPoints);
  BASE.value("renderAverages", renderAverages);

}());
