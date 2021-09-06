(function () {
  ///////// View rendering /////////
  var display = BASE.select('#display');
  var view = {};
  view.init = function () {
    display.innerHTML = `
      <h2>GeoLocation Reader</h2>
      <div class="tab-bar button-bar">
        <button id="tab-1">Position</button>
        <button id="tab-2">Points</button>
      </div>
      <div class="frame avg-div">Loading</div>
      <div class="act-bar button-bar">
        <button id="add">Add Point</button>
        <button id="reset">Reset Point</button>
      </div>
      <div class="frame pos-div">Loading</div>
      <div class="footer-bar" />
    `;
    view.tabBtn1 = display.querySelector('#tab-1');
    view.tabBtn2 = display.querySelector('#tab-2');
    view.addBtn = display.querySelector('#add');
    view.resetBtn = display.querySelector('#reset');
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
    view.resetBtn.addEventListener("click", () => {
      BASE.dispatch('RESET_AVERAGES');
    });
  }

  view.render = function (state) {
    const renderPosition = BASE.value("renderPosition");
    const renderPoints = BASE.value("renderPoints");
    const renderAverages = BASE.value("renderAverages");

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
      case 'ADD_CURRENT_POINT':
        return renderPoints(tab, state.points);
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


  function updateTabs(tab) {
    toggle(view.tabBtn1, tab === "position");
    toggle(view.tabBtn2, tab === "points");
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
