(function () {

  const SEL = BASE.value('SELECTORS');
  const toggleViewBtn = BASE.select(SEL.btnView);
  const toggleRunBtn = BASE.select(SEL.btnRun);
  const viewInput = BASE.select(SEL.viewInput);
  const viewDisplay = BASE.select(SEL.viewDisplay);
  const viewMarker = BASE.select(SEL.viewMarker);

  function showDisplay(show) {
    const display = show ? '' : 'none';
    viewDisplay.style.display = display;
    viewMarker.style.display = display;
    toggleViewBtn.innerHTML = show ? 'Edit' : 'Show';
    viewInput.style.display = show ? 'none' : '';
  }
  showDisplay(false);

  function toggleView() {
    if (toggleViewBtn.innerHTML === 'Edit') {
      showDisplay(false);
    } else {
      showDisplay(true);
      BASE.send('refreshDisplay');
    }
  }
  toggleViewBtn.addEventListener('click', toggleView);

  function toggleRun() {
    if (toggleRunBtn.innerHTML === 'Run') {
      toggleRunBtn.innerHTML = 'Stop';
      showDisplay(true);
      BASE.send('scrollText', true);
    } else {
      toggleRunBtn.innerHTML = 'Run';
      BASE.send('scrollText', false);
    }
  };
  toggleRunBtn.addEventListener('click', toggleRun);

  function changeSpeed(delta) {
    if (delta > 1) BASE.send('SpeedUp');
    if (delta < 1) BASE.send('SlowDown');
  }

  function doReset() {
    BASE.send('reset');
  }

  document.addEventListener('keyup', keyEvent => {
    switch (keyEvent.code) {
      case 'KeyV':
        toggleView();
        break;
      case 'ArrowUp':
      case 'NumpadAdd':
        changeSpeed(+1);
        break;
      case 'ArrowDown':
      case 'NumpadSubtract':
        changeSpeed(-1);
        break;
      case 'KeyR':
      case 'Space':
        toggleRun();
        break;
      case 'Escape':
      case 'KeyX':
        doReset();
        break;
    }
    return false;
  });

}());
