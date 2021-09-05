(function () {
  ///////// View rendering /////////
  var display = BASE.select('#display');
  var view = {};
  view.init = function () {
    display.innerHTML = `
      <h2>GeoLocation Reader</h2>
      <div class="tab-bar" />
      <div class="main-div" />
      <div class="footer-bar" />
    `;
    view.tabs = display.querySelector('.tab-bar');
    view.main = display.querySelector('.main-div');
    view.foot = display.querySelector('.footer-div');
  }

  view.render = function (state) {
    console.log(state);
    const {actionType, error, position} = state;
    switch (actionType) {
      case 'ERROR': return renderError(error);
      case 'POSITION_CHANGED': return renderPosition(position);
      //TODO: allow watch to be switched off/on?
      default: return;
    }
  };

  function renderError(error) {
    view.foot.innerHTML = `ERROR: ${error}`;
  }

  //roll-your-own nullish
  function ifNull(v, other = 'unknown') {return v === null ? other : v;}

  function renderPosition(position) {
    const {accuracy, latitude, longitude, altitude, altitudeAccuracy, heading, speed} = position;
    view.main.innerHTML = `
      <div class='row'>LongLatA : [
        ${longitude}, ${latitude}, ${ifNull(altitude,0)}
      ]</div>
      <div class='row'>Accuracy : ${accuracy}, ${ifNull(altitudeAccuracy, -1)}</div>
      <div class='row'>Heading  : ${ifNull(heading)}</div>
      <div class='row'>Speed    : ${ifNull(speed)}</div>
    `;
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
