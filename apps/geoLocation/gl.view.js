(function () {
  ///////// View rendering /////////
  var display = BASE.select('#display');
  var view = {};
  view.init = function () {
    display.innerHTML = `
      <h2>GeoLocation Reader</h2>
      <div class="tab-bar">
        <button id="tab-1">Position</button>
        <button id="tab-2">Points</button>
        <button id="add">Add Point</button>
      </div>
      <div class="main-div">
        <div class="avg-div">Loading</div>
        <div class="pos-div">Loading</div>
      </div>
      <div class="footer-bar" />
    `;
    view.tabs = display.querySelector('.tab-bar');
    view.tabBtn1 = display.querySelector('#tab-1');
    view.tabBtn2 = display.querySelector('#tab-2');
    view.addBtn = display.querySelector('#add');
    view.main = display.querySelector('.main-div');
    view.foot = display.querySelector('.footer-bar');
    view.pos = display.querySelector('.pos-div');
    view.avg = display.querySelector('.avg-div');
    //Add button click-handlers
    view.tabBtn1.addEventListener("click", () => {
      BASE.dispatch('TAB_CHANGED', 'position');
    });
    view.tabBtn2.addEventListener("click", () => {
      BASE.dispatch('TAB_CHANGED', 'points');
    });
    updateTabs('position'); //set initial tab

    view.addBtn.addEventListener("click", () => {
      BASE.dispatch('ADD_CURRENT_POINT');
    });
    //TODO: clear points? Or just refresh the page?
  }

  view.render = function (state) {
    const {actionType, tab, averages} = state;
    switch (actionType) {
      case 'ERROR':
        return renderError(state.error);
      case 'POSITION_CHANGED': {
        renderPosition(tab, state.position);
        renderAverages(tab, averages);
        return;
      }
      case 'RESET_AVERAGES':
        return renderAverages(tab, averages);
      case 'TAB_CHANGED': {
        updateTabs(tab);
        renderPoints(tab, state.points);
        renderPosition(tab, state.position);
        renderAverages(tab, averages);
        return
      }
        //TODO: allow watch to be switched off/on?
      default:
        return;
    }
  };

  function renderError(error) {
    view.foot.innerHTML = `ERROR: ${error}`;
  }

  //roll-your-own nullish
  function ifNull(v, other = 'unknown') {return v === null ? other : v;}

  function renderPosition(tab, position) {
    if(tab !=='position') return;
    const {accuracy, latitude, longitude, altitude, altitudeAccuracy, heading, speed} = position;
    view.pos.innerHTML = `
      <h3>Real-time geolocation data</h3>
      <div class='row'>LongLatA : [
        ${longitude}, ${latitude}, ${ifNull(altitude,0)}
      ]</div>
      <div class='row'>Accuracy : ${accuracy}, ${ifNull(altitudeAccuracy, -1)}</div>
      <div class='row'>Heading  : ${ifNull(heading)}</div>
      <div class='row'>Speed    : ${ifNull(speed)}</div>
    `;
  }

  function renderPoints(tab, points) {
    if(tab !=='points') return;
    console.log({points});
    view.pos.innerHTML = ['<h3>Stored points data</h3>','<textArea>', ...points.map(p => JSON.stringify(p)),'</textArea>'].join('\n');
  }

  function renderAverages(tab, averages) {
    const {latSum, lngSum, altSum, timestamp, count} = averages;
    console.log(count);
    if(count < 1) return;
    view.avg.innerHTML = `
      <h3>Averaged geolocation data</h3>
      <div class='row'>LongLatA: [
        ${Number(latSum/count).toFixed(9)}, ${Number(lngSum/count).toFixed(9)}, ${Number(altSum/count).toFixed(3)}
      ]</div>
      <div class='row'> Counts = ${count}</div>
      <div class='row'> Last update on ${new Date(timestamp).toISOString()} (${timestamp})</div>
    `;
  }

  function updateTabs(tab) {
    toggle(view.tabBtn1, tab==="position");
    toggle(view.tabBtn2, tab==="points");
  }

  function toggle(btn, flag) {
    if (flag) {
      btn.setAttribute("disabled", "");
    } else {
      btn.removeAttribute("disabled");
    }
  }

  BASE.value("VIEW", view);

}());
